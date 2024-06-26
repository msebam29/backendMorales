document.addEventListener('DOMContentLoaded', function() {
    const newPasswordForm = document.getElementById('newpassword-form');

    newPasswordForm.addEventListener('submit', function(event) {
        event.preventDefault();

        const code = document.getElementById('code').value;
        const password = document.getElementById('password').value;
        const confirmPassword = document.getElementById('confirm_password').value;

        if (password !== confirmPassword) {
            alert('Las contraseñas no coinciden. Por favor, inténtalo de nuevo.');
            return;
        }

        fetch('/api/sessions/newpassword', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                code: code,
                password: password,
            }),
        })
        .then(response => response.json())
        .then(data => {
            console.log(data); 
            if (data.status === 'success') {
                alert('Contraseña actualizada con éxito');
            } else {
                alert(data.message);
            }
        })
    });
});
