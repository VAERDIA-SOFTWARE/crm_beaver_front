// import React, { useState, useEffect } from 'react';
// import ReactQuill from 'react-quill';
// import 'react-quill/dist/quill.snow.css';
// import ReactMarkdown from 'react-markdown';

// const TextEditor = () => {
//   const [markdownContent, setMarkdownContent] = useState('');
//   useEffect(() => {
//     const initialContent = `
//     # Contract Agreement

//     This Contract Agreement ("Agreement") is entered into on this [Date] (the "Effective Date") by and between:

//     \n\n**Party A**\nName: [Party A Name]\nAddress: [Party A Address]\n\n**Party B**\nName: [Party B Name]\nAddress: [Party B Address]\n\n## 1. Purpose\n\nThe purpose of this Agreement is to outline the terms and conditions under which Party A agrees to provide certain services to Party B.\n\n## 2. Scope of Work\n\nParty A agrees to perform the following services ("Services"):\n\n- [Service 1]\n- [Service 2]\n- [Service 3]\n\n## 3. Payment\n\nParty B agrees to pay Party A for the Services rendered according to the following terms:\n\n- The total fee for the Services is [Amount].\n- Payment shall be made in [Currency] within [Number of days] days of completion of the Services.\n\n## 4. Term and Termination\n\nThis Agreement shall commence on the Effective Date and shall remain in effect until the completion of the Services, unless terminated earlier by either party.\n\n## 5. Confidentiality\n\nBoth parties agree to maintain the confidentiality of any proprietary or confidential information shared during the course of this Agreement.\n\n## 6. Governing Law\n\nThis Agreement shall be governed by and construed in accordance with the laws of [Jurisdiction].\n\n## 7. Entire Agreement\n\nThis Agreement constitutes the entire understanding between the parties and supersedes all prior agreements, whether written or oral, relating to the subject matter herein.\n\nEach party acknowledges that they have read and understood this Agreement and agree to be bound by its terms.\n\n**Party A** | **Party B**\n------------ | ------------\nSignature: | Signature:\nName: | Name:\nDate: | Date:\n`;

//     setMarkdownContent(initialContent);
//   }, []);

//   return (
//     <div>
//       <ReactQuill theme="snow" onChange={setMarkdownContent} value={markdownContent} />
//       {/* <ReactMarkdown>{markdownContent}</ReactMarkdown> */}
//     </div>
//   );
// };

// export default TextEditor;

import React, { useRef, useState } from 'react';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
// import '@ckeditor/ckeditor5-build-classic/build/translations/en';

// import './TextEditor.css'; // Custom styles for the editor (optional)
import jsonData from './squelette_contrat.json';

const TextEditor = () => {
  const data = jsonData;
  console.log('====================================');
  console.log(data);
  console.log('====================================');
  const [content, setContent] = useState('');
  const handleEditorChange = (event, editor) => {
    const data = editor.getData();
    console.log(data);
  };
  return (
    <div>
      {Object.values(jsonData).map((item) => (
        <div key={item.id}>
          {Object.values(item.fields).map((field) => (
            <div key={field.id}>
              {field.data && (
                <div style={field.style ? { ...parseStyles(field.style) } : null}>
                  <ContentEditableWithRef
                    value={field?.data}
                    onChange={(e) => {
                      const editorFieldData = e.currentTarget.innerHTML;
                      setContent((d) => {
                        return content?.map((e) => {
                          if (e?.id == item?.id) {
                            const tempD = {
                              ...e,
                              fields: e?.fields?.map((fieldd) => {
                                if (fieldd?.id == field?.id) {
                                  return { ...fieldd, data: editorFieldData };
                                }
                                return fieldd;
                              })
                            };
                            return tempD;
                          }
                          return e;
                        });
                      });
                    }}
                    style={{
                      padding: 10,
                      border: '1px solid #a1a1a1',
                      borderRadius: 10,
                      boxShadow: '0px 2px 1px -1px rgba(0,0,0,0.2),0px 1px 1px 0px rgba(0,0,0,0.14),0px 1px 3px 0px rgba(0,0,0,0.12)'
                    }}
                  />
                  <CKEditor
                    config={{
                      // plugins: ['GeneralHtmlSupport'],
                      // extraPlugins: ['GeneralHtmlSupport'],
                      toolbar: null,
                      htmlSupport: {
                        allow: [
                          {
                            // name: /^(|section|div|small|ul|li|td|tbody|th|ol|a|button|p|h[1-6])$/,
                            name: /.*/,
                            attributes: true,
                            classes: true,
                            styles: true
                          }
                        ]
                      }
                    }}
                    editor={ClassicEditor}
                    data={field.data}
                    onChange={handleEditorChange}
                  />
                </div>
              )}
            </div>
          ))}
        </div>
      ))}
    </div>

    // <CKEditor key={field.id} editor={ClassicEditor} data={field.field} onChange={handleEditorChange} />
    // <CKEditor
    //   editor={ClassicEditor}
    //   data="<p>Hello from CKEditor 5!</p>"
    //   onReady={(editor) => {
    //     // You can store the "editor" and use when it is needed.
    //     console.log('Editor is ready to use!', editor);
    //   }}
    //   onChange={(event, editor) => {
    //     const data = editor.getData();
    //     console.log({ event, editor, data });
    //   }}
    //   onBlur={(event, editor) => {
    //     console.log('Blur.', editor);
    //   }}
    //   onFocus={(event, editor) => {
    //     console.log('Focus.', editor);
    //   }}
    // />
  );
};
const parseStyles = (styles) => {
  return styles.split(';').reduce((result, style) => {
    if (style) {
      const [property, value] = style.split(':');
      if (property && value) {
        result[property.trim()] = value.trim();
      }
    }
    return result;
  }, {});
};

export default TextEditor;

const ContentEditableWithRef = (props) => {
  const defaultValue = useRef(props.value);

  const handleInput = (event) => {
    if (props.onChange) {
      props.onChange(event);
    }
  };

  return <div contentEditable style={props?.style} onInput={handleInput} dangerouslySetInnerHTML={{ __html: defaultValue.current }} />;
};
