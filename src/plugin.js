function initPlugin() {
  const onFileInput = function(editor, file) {
    const img = editor.dom.create('img', {id: `tinymce-new-image-${file.name}`});
    editor.selection.setNode(img);

    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const base64Data = reader.result;
      editor.dom.setAttrib(`*[id="tinymce-new-image-${file.name}"]`, { src, base64Data });

      const handler = editor.getParam('images_upload_handler');
      handler(
        file,
        (url) => {
          editor.dom.setAttrib(`*[id="tinymce-new-image-${file.name}"]`, { src, url, id: null });
        },
        (err) => {
          alert('Upload failed');
        }
      );
    }
  }

  tinymce.create('tinymce.plugins.SynapImages', {

    init: function (ed) {
        ed.addButton('upload-button', {
            icon: 'image',
            tooltip: 'Insert an image',
            onClick: function (wrappingEvent) {
              const input = document.createElement('input');

              input.setAttribute('type', 'file');
              input.setAttribute('accept', 'image/*');

              input.onchange = (e) => {
                e.preventDefault();
                const files = e.target.files;

                if (files.length) {
                  onFileInput(ed, files[0]);
                }
              }

              input.click();
            }
        });
    },

    getInfo: function () {
        return {
            longname: 'synap-images',
            author: 'Jesse Cooper',
            version: tinymce.majorVersion + '.' + tinymce.minorVersion
        };
    }
  });

  tinymce.PluginManager.add('synap-images', tinymce.plugins.SynapImages);
};

initPlugin();