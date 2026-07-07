const { Parser } = require('json2csv');
const PDFDocument = require('pdfkit');
const Issue = require('../models/Issue');
const { asyncHandler } = require('../middlewares/asyncHandler');
const { ErrorResponse } = require('../utils/apiResponse');

exports.exportIssues = asyncHandler(async (req, res, next) => {
  const { format = 'pdf', range = '30days' } = req.query;

  // Calculate date range
  let dateQuery = {};
  const now = new Date();
  
  if (range === '7days') {
    dateQuery = { createdAt: { $gte: new Date(now.setDate(now.getDate() - 7)) } };
  } else if (range === '30days') {
    dateQuery = { createdAt: { $gte: new Date(now.setDate(now.getDate() - 30)) } };
  } else if (range === 'thisYear') {
    dateQuery = { createdAt: { $gte: new Date(now.getFullYear(), 0, 1) } };
  }

  // Fetch data
  const issues = await Issue.find(dateQuery)
    .populate('reportedBy', 'name email role')
    .populate('assignedTo', 'name email')
    .populate('school', 'schoolName')
    .sort('-createdAt');

  if (format === 'csv') {
    const fields = [
      { label: 'Issue ID', value: 'issueId' },
      { label: 'Title', value: 'title' },
      { label: 'Status', value: 'status' },
      { label: 'Priority', value: 'priority' },
      { label: 'Category', value: 'category' },
      { label: 'Location', value: 'location' },
      { label: 'Reported By', value: 'reportedBy.name' },
      { label: 'Reported Date', value: (row) => new Date(row.createdAt).toLocaleDateString() }
    ];
    
    const json2csvParser = new Parser({ fields });
    const csv = json2csvParser.parse(issues);

    res.header('Content-Type', 'text/csv');
    res.attachment(`issues_report_${Date.now()}.csv`);
    return res.send(csv);
  } 
  
  if (format === 'pdf') {
    const doc = new PDFDocument({ margin: 50 });
    
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=issues_report_${Date.now()}.pdf`);
    
    doc.pipe(res);

    // PDF Header
    doc.fontSize(20).text('School Guardian System Report', { align: 'center' });
    doc.moveDown();
    doc.fontSize(12).text(`Generated On: ${new Date().toLocaleString()}`, { align: 'center' });
    doc.text(`Total Issues: ${issues.length}`, { align: 'center' });
    doc.moveDown(2);

    // List issues
    issues.forEach((issue, index) => {
      doc.fontSize(14).font('Helvetica-Bold').text(`${index + 1}. [${issue.issueId}] ${issue.title}`);
      doc.fontSize(10).font('Helvetica').text(`Status: ${issue.status} | Priority: ${issue.priority} | Category: ${issue.category}`);
      doc.text(`Location: ${issue.location}`);
      doc.text(`Reported By: ${issue.reportedBy?.name || 'N/A'} on ${new Date(issue.createdAt).toLocaleDateString()}`);
      doc.moveDown();
      doc.text(`Description: ${issue.description}`);
      doc.moveDown(2);
    });

    doc.end();
    return;
  }

  return next(new ErrorResponse('Invalid format requested', 400));
});
