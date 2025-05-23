import { format } from 'date-fns';

/**
 * Creates a beautifully styled HTML template specifically for complaint reports
 * @param {any} data - The complaint data
 * @returns {string} The HTML template
 */
export const createComplaintReportTemplate = (data: any) => {
  // Format date if it exists
  const formattedDate = data.submittedAt 
    ? format(new Date(data.submittedAt), 'dd MMM yyyy hh:mm a')
    : format(new Date(), 'dd MMM yyyy hh:mm a');

  // Extract client details and form data
  const {
    complaintNo = '',
    clientName = '',
    workStatus = '',
    remark = '',
    assignDate = '',
    systemName = '',
    location = '',
    status = '',
    taskType = '',
    // New form fields
    faultReported = '',
    typeOfCall = '',
    callAttendedDate = '',
    callAttendedTime = '',
    callCompletedDate = '',
    callCompletedTime = '',
    partReplaced = '',
    causeProblem = '',
    diagnosis = '',
    materialTakenOut = '',
  } = data;

  // Format the attended and completed dates/times
  const attendedDateTime = callAttendedDate && callAttendedTime 
    ? `${callAttendedDate} ${callAttendedTime}`
    : 'Not specified';

  const completedDateTime = callCompletedDate && callCompletedTime 
    ? `${callCompletedDate} ${callCompletedTime}`
    : 'Not specified';

  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <title>Complaint Report - ${complaintNo}</title>
        <style>
          @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');
          
          :root {
            --primary-color: #0078d4;
            --primary-dark: #005a9e;
            --secondary-color: #2b88d8;
            --text-primary: #323130;
            --text-secondary: #605e5c;
            --border-color: #edebe9;
            --background-light: #f3f2f1;
            --success-color: #107c10;
            --warning-color: #ff8c00;
            --error-color: #d13438;
            --info-color: #0078d4;
          }
          
          body {
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
            color: var(--text-primary);
            margin: 0;
            padding: 0;
            background-color: var(--background-light);
            line-height: 1.5;
          }
          
          .container {
            max-width: 850px;
            margin: 20px auto;
            background-color: white;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
            border-radius: 8px;
            overflow: hidden;
          }
          
          .header {
            background: linear-gradient(135deg, var(--primary-color), var(--primary-dark));
            color: white;
            padding: 30px;
            text-align: center;
            position: relative;
          }
          
          .header::after {
            content: '';
            position: absolute;
            bottom: 0;
            left: 0;
            right: 0;
            height: 4px;
            background: linear-gradient(90deg, var(--success-color), var(--info-color), var(--warning-color));
          }
          
          .company-name {
            font-size: 28px;
            font-weight: 700;
            margin: 0;
            text-transform: uppercase;
            letter-spacing: 1px;
          }
          
          .document-title {
            font-size: 20px;
            margin-top: 8px;
            font-weight: 400;
            opacity: 0.9;
          }
          
          .complaint-number {
            background-color: var(--background-light);
            padding: 15px 20px;
            text-align: center;
            font-size: 18px;
            font-weight: 600;
            color: var(--primary-color);
            border-bottom: 1px solid var(--border-color);
            display: flex;
            align-items: center;
            justify-content: center;
          }
          
          .complaint-number::before {
            content: '📋';
            margin-right: 10px;
            font-size: 20px;
          }
          
          .section {
            padding: 25px;
            border-bottom: 1px solid var(--border-color);
          }
          
          .section:last-child {
            border-bottom: none;
          }
          
          .section-title {
            font-size: 18px;
            font-weight: 600;
            color: var(--primary-color);
            margin-bottom: 20px;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            display: flex;
            align-items: center;
          }
          
          .section-title::before {
            content: '';
            display: inline-block;
            width: 4px;
            height: 20px;
            background-color: var(--primary-color);
            margin-right: 10px;
            border-radius: 2px;
          }
          
          .info-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
            gap: 20px;
          }
          
          .info-item {
            margin-bottom: 15px;
            display: flex;
            flex-direction: column;
          }
          
          .info-label {
            font-weight: 500;
            color: var(--text-secondary);
            font-size: 14px;
            margin-bottom: 5px;
            text-transform: uppercase;
            letter-spacing: 0.5px;
          }
          
          .info-value {
            font-weight: 400;
            font-size: 16px;
            color: var(--text-primary);
            padding: 8px 12px;
            background-color: var(--background-light);
            border-radius: 4px;
            border-left: 3px solid var(--primary-color);
          }
          
          .remark-section {
            background-color: var(--background-light);
            padding: 20px;
            border-radius: 6px;
            margin-top: 20px;
            border: 1px solid var(--border-color);
          }
          
          .remark-text {
            font-style: italic;
            color: var(--text-secondary);
            line-height: 1.6;
            padding: 10px;
            background-color: white;
            border-radius: 4px;
            border-left: 3px solid var(--info-color);
          }
          
          .signatures {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 30px;
            padding: 30px;
            background-color: var(--background-light);
          }
          
          .signature-box {
            background-color: white;
            padding: 20px;
            border-radius: 6px;
            text-align: center;
            box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
          }
          
          .signature-label {
            font-size: 14px;
            color: var(--text-secondary);
            margin-bottom: 10px;
            font-weight: 500;
          }
          
          .signature-placeholder {
            color: var(--text-secondary);
            font-style: italic;
            padding: 20px;
            border: 1px dashed var(--border-color);
            border-radius: 4px;
            margin-top: 10px;
          }
          
          .footer {
            background-color: var(--background-light);
            padding: 20px;
            text-align: center;
            font-size: 12px;
            color: var(--text-secondary);
            border-top: 1px solid var(--border-color);
          }
          
          .status-tag {
            display: inline-block;
            padding: 6px 12px;
            border-radius: 4px;
            font-size: 14px;
            font-weight: 500;
            text-transform: uppercase;
            letter-spacing: 0.5px;
          }
          
          .status-completed {
            background-color: #e6f4ea;
            color: var(--success-color);
            border: 1px solid #c6e0c6;
          }
          
          .status-pending {
            background-color: #fff4ce;
            color: var(--warning-color);
            border: 1px solid #ffe7a3;
          }
          
          .status-standby {
            background-color: #e6f4ff;
            color: var(--info-color);
            border: 1px solid #c6e0ff;
          }
          
          .status-observation {
            background-color: #fce8e6;
            color: var(--error-color);
            border: 1px solid #f9d9d7;
          }
          
          @media print {
            body {
              background-color: white;
            }
            
            .container {
              box-shadow: none;
              margin: 0;
            }
            
            .section {
              break-inside: avoid;
            }
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1 class="company-name">Magnum CRM</h1>
            <div class="document-title">Complaint Report</div>
          </div>
          
          <div class="complaint-number">
            Complaint No: ${complaintNo}
          </div>
          
          <div class="section">
            <div class="section-title">Client Information</div>
            <div class="info-grid">
              <div class="info-item">
                <div class="info-label">Client Name</div>
                <div class="info-value">${clientName}</div>
              </div>
              <div class="info-item">
                <div class="info-label">System Name</div>
                <div class="info-value">${systemName || 'N/A'}</div>
              </div>
              <div class="info-item">
                <div class="info-label">Location</div>
                <div class="info-value">${location || 'N/A'}</div>
              </div>
              <div class="info-item">
                <div class="info-label">Task Type</div>
                <div class="info-value">${taskType || 'N/A'}</div>
              </div>
              <div class="info-item">
                <div class="info-label">Assigned Date</div>
                <div class="info-value">${assignDate || 'N/A'}</div>
              </div>
            </div>
          </div>
          
          <div class="section">
            <div class="section-title">Complaint Details</div>
            <div class="info-grid">
              <div class="info-item">
                <div class="info-label">Fault Reported</div>
                <div class="info-value">${faultReported || 'N/A'}</div>
              </div>
              <div class="info-item">
                <div class="info-label">Type of Call</div>
                <div class="info-value">${typeOfCall || 'N/A'}</div>
              </div>
              <div class="info-item">
                <div class="info-label">Call Attended On</div>
                <div class="info-value">${attendedDateTime}</div>
              </div>
              <div class="info-item">
                <div class="info-label">Call Completed On</div>
                <div class="info-value">${completedDateTime}</div>
              </div>
            </div>
          </div>

          <div class="section">
            <div class="section-title">Technical Details</div>
            <div class="info-grid">
              <div class="info-item">
                <div class="info-label">Part Replaced/Stand by</div>
                <div class="info-value">${partReplaced || 'None'}</div>
              </div>
              <div class="info-item">
                <div class="info-label">Cause of Problem</div>
                <div class="info-value">${causeProblem || 'Not specified'}</div>
              </div>
              <div class="info-item">
                <div class="info-label">Diagnosis</div>
                <div class="info-value">${diagnosis || 'Not specified'}</div>
              </div>
              <div class="info-item">
                <div class="info-label">Material Taken Out</div>
                <div class="info-value">${materialTakenOut || 'None'}</div>
              </div>
            </div>
          </div>
          
          <div class="section">
            <div class="section-title">Status Information</div>
            <div class="info-grid">
              <div class="info-item">
                <div class="info-label">Current Status</div>
                <div class="info-value">
                  <span class="status-tag ${
                    workStatus?.toLowerCase().includes('complete') ? 'status-completed' : 
                    workStatus?.toLowerCase().includes('stand by') ? 'status-standby' :
                    workStatus?.toLowerCase().includes('observation') ? 'status-observation' : 
                    'status-pending'
                  }">
                    ${workStatus || 'Pending'}
                  </span>
                </div>
              </div>
              <div class="info-item">
                <div class="info-label">Submission Date</div>
                <div class="info-value">${formattedDate}</div>
              </div>
            </div>
            
            <div class="remark-section">
              <div class="section-title">Remarks</div>
              <div class="remark-text">${remark || 'No remarks provided.'}</div>
            </div>
          </div>
          
          <div class="signatures">
            <div class="signature-box">
              <div class="signature-label">Engineer's Signature</div>
              <div class="signature-placeholder">Engineer's signature</div>
            </div>
            <div class="signature-box">
              <div class="signature-label">Client's Signature</div>
              <div class="signature-placeholder">Client's signature</div>
            </div>
          </div>
          
          <div class="footer">
            <p>This document was automatically generated by Magnum CRM on ${formattedDate}</p>
            <p>© ${new Date().getFullYear()} Magnum Systems - All Rights Reserved</p>
          </div>
        </div>
      </body>
    </html>
  `;
}; 