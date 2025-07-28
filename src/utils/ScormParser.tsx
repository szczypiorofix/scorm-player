import type { Item, Organization, Resource, ScormManifest } from "../shared/types";

export class ScormParser {
    static parseManifest(xmlContent: string): ScormManifest {
        const parser = new DOMParser();
        const doc = parser.parseFromString(xmlContent, 'text/xml');

        const parserError = doc.querySelector('parsererror');
        if (parserError) {
            throw new Error('Invalid XML format');
        }

        const manifest = doc.querySelector('manifest');
        if (!manifest) {
            throw new Error('No manifest element found');
        }

        const identifier = manifest.getAttribute('identifier') || '';
        const version = manifest.getAttribute('version') || '1.2';

        const title = this.getTextContent(doc, 'title') || 'Untitled Course';
        const description = this.getTextContent(doc, 'description');

        const organizations = this.parseOrganizations(doc);
        const defaultOrganization = manifest.getAttribute('default') || organizations[0]?.identifier;

        const resources = this.parseResources(doc);

        return {
            identifier,
            version,
            title,
            description,
            organizations,
            resources,
            defaultOrganization
        };
    }

    static getLaunchUrl(manifest: ScormManifest): string | null {
        const defaultOrg = manifest.organizations.find(
            org => org.identifier === manifest.defaultOrganization
        ) || manifest.organizations[0];

        if (!defaultOrg || defaultOrg.items.length === 0) {
            return null;
        }

        const firstItem = defaultOrg.items[0];
        if (!firstItem.identifierref) {
            return null;
        }

        const resource = manifest.resources.find(
            res => res.identifier === firstItem.identifierref
        );

        return resource?.href || null;
    }

    static getLaunchableItems(manifest: ScormManifest): Array<{
        title: string;
        identifier: string;
        url: string;
    }> {
        const items: Array<{ title: string; identifier: string; url: string }> = [];

        manifest.organizations.forEach(org => {
            this.extractLaunchableItems(org.items, manifest.resources, items);
        });

        return items;
    }

    private static extractLaunchableItems(
        items: Item[],
        resources: Resource[],
        result: Array<{ title: string; identifier: string; url: string }>
    ): void {
        items.forEach(item => {
            if (item.identifierref) {
                const resource = resources.find(res => res.identifier === item.identifierref);
                if (resource?.href) {
                    result.push({
                        title: item.title,
                        identifier: item.identifier,
                        url: resource.href
                    });
                }
            }

            if (item.items) {
                this.extractLaunchableItems(item.items, resources, result);
            }
        });
    }

    private static parseOrganizations(doc: Document): Organization[] {
        const organizations: Organization[] = [];
        const orgElements = doc.querySelectorAll('organizations > organization');

        orgElements.forEach(orgElement => {
            const identifier = orgElement.getAttribute('identifier') || '';
            const title = this.getTextContent(orgElement, 'title') || 'Untitled Organization';
            const items = this.parseItems(orgElement);

            organizations.push({
                identifier,
                title,
                items
            });
        });

        return organizations;
    }

    private static parseItems(parent: Element): Item[] {
        const items: Item[] = [];
        const itemElements = parent.querySelectorAll(':scope > item');

        itemElements.forEach(itemElement => {
            const identifier = itemElement.getAttribute('identifier') || '';
            const identifierref = itemElement.getAttribute('identifierref') || undefined;
            const title = this.getTextContent(itemElement, 'title') || 'Untitled Item';

            const nestedItems = this.parseItems(itemElement);

            items.push({
                identifier,
                title,
                identifierref,
                items: nestedItems.length > 0 ? nestedItems : undefined
            });
        });

        return items;
    }

    private static parseResources(doc: Document): Resource[] {
        const resources: Resource[] = [];
        const resourceElements = doc.querySelectorAll('resources > resource');

        resourceElements.forEach(resourceElement => {
            const identifier = resourceElement.getAttribute('identifier') || '';
            const type = resourceElement.getAttribute('type') || '';
            const href = resourceElement.getAttribute('href') || '';

            const files: string[] = [];
            const fileElements = resourceElement.querySelectorAll('file');
            fileElements.forEach(fileElement => {
                const filehref = fileElement.getAttribute('href');
                if (filehref) {
                    files.push(filehref);
                }
            });

            resources.push({
                identifier,
                type,
                href,
                files
            });
        });

        return resources;
    }

    private static getTextContent(parent: Element | Document, tagName: string): string | undefined {
        const element = parent.querySelector(tagName);
        return element?.textContent?.trim() || undefined;
    }
}
