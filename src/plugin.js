function initPlugin() {
  const onFileInput = function(editor, file) {
    // We use TinyMCE's editor.dom here (rather than document.createElement) as it is empirically more reliable within the editor
    const img = editor.dom.create('img', {id: `tinymce-new-image-${file.name}`});
    editor.selection.setNode(img);

    // Get Base64 data of the image so that the user sees the image right away
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const base64Data = reader.result;
      const img = editor.dom.select(`*[id="tinymce-new-image-${file.name}"]`)[0];
      img.setAttribute('src', base64Data);

      const handler = editor.getParam('images_upload_handler');
      handler(
        file,
        (url) => {
          const img = editor.dom.select(`*[id="tinymce-new-image-${file.name}"]`)[0];
          img.setAttribute('src', url);
          img.setAttribute('id', '');
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
            onClick: function (e) {
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