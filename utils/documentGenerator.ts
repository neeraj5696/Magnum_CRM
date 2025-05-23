import { Platform } from 'react-native';
import * as FileSystem from 'expo-file-system';
import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';
import { Alert } from 'react-native';
import { format } from 'date-fns';

/**
 * Generate PDF from HTML content and download it
 * @param {string} htmlContent HTML string for PDF content
 * @param {string} fileName Name of the file to save (without extension)
 */
export const generatePdfFromHtml = async (htmlContent: string, fileName: string) => {
  try {
    // Generate PDF using expo-print
    const { uri } = await Print.printToFileAsync({
      html: htmlContent,
      base64: false,
    });
    
    if (Platform.OS === 'web') {
      await saveWebFile(uri, `${fileName}.pdf`);
    } else {
      // For mobile platforms, use sharing
      await shareMobileFile(uri, `${fileName}.pdf`);
    }
    
    return true;
  } catch (error) {
    console.error('Error generating PDF:', error);
    Alert.alert('Error', 'Failed to generate PDF document. Please try again.');
    return false;
  }
};

/**
 * Generate and download a DOCX file (only available on web)
 * This is a simple implementation using HTML to create DOCX
 * For more complex documents, consider using a specialized library
 */
export const generateDocxFromHtml = async (htmlContent: string, fileName: string) => {
  if (Platform.OS !== 'web') {
    Alert.alert('Feature Not Available', 'DOCX generation is only available on web currently.');
    return false;
  }
  
  try {
    // On Web, we can try to use a simple approach by setting up downloadable HTML with MS Word mimetype
    const blob = new Blob([htmlContent], { type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' });
    const url = URL.createObjectURL(blob);
    
    // Create and click a download link
    const link = document.createElement('a');
    link.href = url;
    link.download = `${fileName}.docx`;
    link.click();
    
    // Clean up
    URL.revokeObjectURL(url);
    
    return true;
  } catch (error) {
    console.error('Error generating DOCX:', error);
    Alert.alert('Error', 'Failed to generate DOCX document. Please try again.');
    return false;
  }
};

/**
 * Create HTML template for form data
 * @param {object} data The form data to include in the PDF
 * @param {string} title The title for the document
 */
export const createHtmlTemplate = (data: any, title: string) => {
  // Format date fields if they exist
  const formatDateTimeFields = (data: any) => {
    const formattedData = { ...data };
    
    // Format submission date
    if (formattedData.submittedAt) {
      formattedData.submittedAt = format(new Date(formattedData.submittedAt), 'dd MMM yyyy hh:mm a');
    }
    
    // Format call attended and completed dates
    if (formattedData.callAttendedDate && formattedData.callAttendedTime) {
      formattedData.callAttendedDateTime = `${formattedData.callAttendedDate} ${formattedData.callAttendedTime}`;
    }
    
    if (formattedData.callCompletedDate && formattedData.callCompletedTime) {
      formattedData.callCompletedDateTime = `${formattedData.callCompletedDate} ${formattedData.callCompletedTime}`;
    }
    
    return formattedData;
  };
  
  // Format and organize data
  const processedData = formatDateTimeFields(data);

  // Convert the data object to a formatted HTML table
  const dataRows = Object.entries(processedData).map(([key, value]) => {
    // Skip null, undefined, or empty values
    if (value === null || value === undefined || value === '') {
      return '';
    }
    
    // Skip individual date/time fields since we show them combined
    if (['callAttendedDate', 'callAttendedTime', 'callCompletedDate', 'callCompletedTime'].includes(key)) {
      return '';
    }
    
    // Format date objects
    if (value instanceof Date) {
      return `
        <tr>
          <td><strong>${formatLabel(key)}</strong></td>
          <td>${value.toLocaleDateString()} ${value.toLocaleTimeString()}</td>
        </tr>
      `;
    }
    
    return `
      <tr>
        <td><strong>${formatLabel(key)}</strong></td>
        <td>${value}</td>
      </tr>
    `;
  }).join('');

  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <title>${title}</title>
        <style>
          body {
            font-family: 'Helvetica', Arial, sans-serif;
            color: #333;
            padding: 20px;
          }
          .header {
            text-align: center;
            padding-bottom: 20px;
            border-bottom: 1px solid #ddd;
            margin-bottom: 20px;
          }
          .logo {
            max-width: 200px;
            max-height: 80px;
          }
          h1 {
            color: #0066cc;
            font-size: 24px;
            margin-bottom: 5px;
          }
          .document-date {
            color: #666;
            font-size: 14px;
            margin-bottom: 30px;
          }
          table {
            width: 100%;
            border-collapse: collapse;
          }
          table td, table th {
            border: 1px solid #ddd;
            padding: 12px 8px;
          }
          table tr:nth-child(even) {
            background-color: #f2f2f2;
          }
          .footer {
            margin-top: 40px;
            text-align: center;
            font-size: 12px;
            color: #666;
          }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>${title}</h1>
          <div class="document-date">Generated on: ${new Date().toLocaleString()}</div>
        </div>

        <table>
          ${dataRows}
        </table>

        <div class="footer">
          <p>This document was automatically generated by Magnum CRM</p>
        </div>
      </body>
    </html>
  `;
};

// Helper functions

const formatLabel = (key: string) => {
  return key
    .replace(/([A-Z])/g, ' $1') // Insert space before uppercase letters
    .replace(/_/g, ' ') // Replace underscores with spaces
    .replace(/^\w/, (c) => c.toUpperCase()); // Capitalize first letter
};

const saveWebFile = async (uri: string, fileName: string) => {
  try {
    // For web, we need to download the file
    // Fetch the file and convert to blob
    const response = await fetch(uri);
    const blob = await response.blob();
    
    // Create a link element and trigger download
    const link = document.createElement('a');
    const url = window.URL.createObjectURL(blob);
    link.href = url;
    link.download = fileName;
    link.click();
    
    // Clean up
    window.URL.revokeObjectURL(url);
    Alert.alert('Success', `File downloaded as ${fileName}`);
  } catch (error) {
    console.error('Error saving file on web:', error);
    Alert.alert('Error', 'Failed to download file');
  }
};

const shareMobileFile = async (uri: string, filename: string) => {
  try {
    // Check if sharing is available
    const isSharingAvailable = await Sharing.isAvailableAsync();
    if (!isSharingAvailable) {
      Alert.alert('Error', 'Sharing is not available on this device');
      return;
    }

    // Share the file
    await Sharing.shareAsync(uri, {
      mimeType: 'application/pdf',
      dialogTitle: 'Save or Share Document',
      UTI: 'com.adobe.pdf'
    });
  } catch (error) {
    console.error('Error sharing file:', error);
    Alert.alert('Error', 'Failed to share file');
  }
}; 