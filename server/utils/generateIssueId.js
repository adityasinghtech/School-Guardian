const generateIssueId = () => {
    const timestamp = Date.now().toString(36).toUpperCase();
    const randomStr = Math.random().toString(36).substring(2, 5).toUpperCase();
    return `ISS-${timestamp}-${randomStr}`;
};
module.exports = generateIssueId;