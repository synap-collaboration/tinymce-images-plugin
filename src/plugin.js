tinymce.create('tinymce.plugins.SynapImage', {

  init: function (ed) {
      ed.addButton('upload-button', {
          icon: 'image',
          tooltip: 'Insert an image',
          onClick: (wrappingEvent) => {
            const input = document.createElement('input');

            input.setAttribute('type', 'file');
            input.setAttribute('accept', 'image/*');

            input.onchange = (e) => {
              e.preventDefault();
              const files = e.target.files;

              e.target.value = !files.length ? null : files[0];

              if (files.length) {
                wrappingEvent.target.onchange();
              }
            }

            // input.click();
          }
      });
  },

  getInfo: function () {
      return {
          longname: 'synap-image',
          author: 'Jesse Cooper',
          version: tinymce.majorVersion + '.' + tinymce.minorVersion
      };
  }
});

tinymce.PluginManager.add('synap-image', tinymce.plugins.SynapImage);