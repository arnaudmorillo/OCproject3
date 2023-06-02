// Function for login invalid user or password
function loginError(){
    const messagediv = document.querySelector(".login-message");
    const message = document.createElement("p");
    message.innerText = "Erreur dans l’identifiant ou le mot de passe";
    messagediv.appendChild(message)      
}

// Function for login
function login() {
	const loginForm = document.querySelector(".login-form");
	loginForm.addEventListener("submit", function (event) {
		event.preventDefault();

        // Clearing a possible previous login error message
        const loginMessage = document.querySelector(".login-message");
        loginMessage.innerHTML = "";

		// Acquiring email and password from form
		const authentication = {
			email: event.target.querySelector("[name=email]").value,
			password: event.target.querySelector("[name=password]").value,
		};
		const authenticationFormat = JSON.stringify(authentication);

		// Post to the API
		fetch("http://localhost:5678/api/users/login", {
			method: "POST",
			headers: { "Content-Type": "application/json", "accept" : "application/json" },
			body: authenticationFormat
		})

        // Checking response status and either store the token or warn user of incorrect email or password
        .then(function(response) {
            if (response.status == 200) {
                return response.json()
                .then(function(data) {
                    sessionStorage.setItem("token", data.token);
                    location.href = "index.html"
                })
            } else {
                loginError()
            }
        })

	});
}

login();