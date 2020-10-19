let working = false;
ipcRenderer.on('show', () => {
  console.log('Now Showing');
  $('.wrapper').toggle('slide', { direction: 'right', duration: 500 }, () => {
    // window.close();
  });
});
$('.login').on('submit', function (e) {
  e.preventDefault();
  if (working) return;
  working = true;
  const $this = $(this);
  const $state = $this.find('button > .state');
  const username = $this.find('#username').val();
  const password = $this.find('#password').val();
  if (username && username.length && password && password.length) {
    $this.addClass('loading');
    $state.html('Verifica in corso');
    ipcRenderer.send('check-login', {
      username,
      password,
    });

    ipcRenderer.once('check-login-result', (event, arg) => {
      // console.log('Got Reply');
      if (arg) {
        $this.addClass('ok');
        $state.html('Grazie!');
        setTimeout(() => {
          // window.close();
          $('.wrapper').toggle('slide', { direction: 'right' }, () => {
            window.close();
          });
        }, 3000);
      } else {
        $state.html('Accedi');
        $this.removeClass('ok loading');
        working = false;
      }
    });
  }
});
