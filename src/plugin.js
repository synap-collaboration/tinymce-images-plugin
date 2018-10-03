function initPlugin() {
  const onFileInput = function(editor, file) {
    const img = editor.dom.create('img');
    editor.selection.setNode(img);
    // img.setAttribute('data-mce-id', '__mcenew');

    // editor.focus();
    // editor.selection.setContent(img.outerHTML);

    // const insertedElem = editor.dom.select('*[data-mce-id="__mcenew"]')[0];
    // insertedElem.setAttribute('data-mce-id', null);

    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const base64Data = reader.result;
      img.src = base64Data;

      const handler = editor.getParam('images_upload_handler');
      handler(
        file,
        (url) => {
          img.src = url;
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