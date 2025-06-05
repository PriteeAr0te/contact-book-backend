export const extractPublicId = (url) => {
    if (!url) return null;
    const withoutVersion = url.split('?')[0];
    const parts = withoutVersion.split('/');
    const fileWithExt = parts[parts.length - 1];
    const publicId = fileWithExt.split('.')[0];
    return `ContactBook/${publicId}`;
};