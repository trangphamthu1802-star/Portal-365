import { useRef } from 'react';
import { Editor } from '@tinymce/tinymce-react';
import type { Editor as TinyMCEEditor } from 'tinymce';

interface RichTextEditorProps {
  value: string;
  onChange: (content: string) => void;
  height?: number;
  placeholder?: string;
}

export default function RichTextEditor({ 
  value, 
  onChange, 
  height = 500,
  placeholder = 'Nhập nội dung...'
}: RichTextEditorProps) {
  const editorRef = useRef<TinyMCEEditor | null>(null);

  return (
    <Editor
      tinymceScriptSrc="/tinymce/tinymce.min.js"
      licenseKey="gpl"
      onInit={(_evt, editor) => editorRef.current = editor}
      value={value}
      onEditorChange={(content) => onChange(content)}
      init={{
        height,
        menubar: true,
        plugins: [
          'advlist', 'autolink', 'lists', 'link', 'image', 'charmap', 'preview',
          'anchor', 'searchreplace', 'visualblocks', 'code', 'fullscreen',
          'insertdatetime', 'media', 'table', 'code', 'help', 'wordcount',
          'paste'
        ],
        toolbar: 
          'undo redo | blocks | ' +
          'bold italic forecolor backcolor | alignleft aligncenter ' +
          'alignright alignjustify | bullist numlist outdent indent | ' +
          'removeformat | image media table | code fullscreen | help',
        
        // Paste configuration
        paste_data_images: true, // Cho phép paste ảnh từ clipboard
        paste_as_text: false,
        paste_webkit_styles: 'all',
        paste_merge_formats: true,
        paste_remove_styles_if_webkit: false,
        
        // Image configuration
        automatic_uploads: false, // Tắt auto upload, sẽ convert thành base64
        images_upload_handler: async (blobInfo) => {
          // Convert image to base64 (embedded trong HTML)
          return new Promise((resolve) => {
            const reader = new FileReader();
            reader.onloadend = () => {
              resolve(reader.result as string);
            };
            reader.readAsDataURL(blobInfo.blob());
          });
        },
        
        // Content styling
        content_style: `
          body { 
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif;
            font-size: 14px;
            line-height: 1.6;
            padding: 10px;
          }
          img {
            max-width: 100%;
            height: auto;
            display: block;
            margin: 10px 0;
          }
          table {
            border-collapse: collapse;
            width: 100%;
          }
          table td, table th {
            border: 1px solid #ddd;
            padding: 8px;
          }
        `,
        
        // Language
        language: 'vi_VN',
        language_url: '/tinymce/langs/vi_VN.js', // Tải file ngôn ngữ nếu có
        
        // Placeholder
        placeholder,
        
        // Other settings
        branding: false, // Ẩn "Powered by TinyMCE"
        promotion: false,
        resize: true,
        elementpath: false,
        statusbar: true,
        
        // Block formats
        block_formats: 'Đoạn văn=p; Tiêu đề 1=h1; Tiêu đề 2=h2; Tiêu đề 3=h3; Tiêu đề 4=h4; Trích dẫn=blockquote; Code=pre',
        
        // Font formats
        font_size_formats: '8pt 10pt 12pt 14pt 16pt 18pt 24pt 36pt 48pt',
        
        // Color picker
        color_cols: 5,
        custom_colors: false,
        
        // Media embed
        media_live_embeds: true,
        
        // Valid elements - cho phép tất cả HTML tags
        valid_elements: '*[*]',
        extended_valid_elements: '*[*]',
        valid_children: '+body[style]',
      }}
    />
  );
}
