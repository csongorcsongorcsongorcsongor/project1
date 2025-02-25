function Register() {

    const username = document.getElementById('usernameInput').value;
    const password = document.getElementById('passwordInput').value;
    const amount = document.getElementById('amountInput').value;

    // Validate username length
    if (username.length < 3) {
        showalertshit("Túl rövid felhasználó név");
        return; // Exit the function if validation fails
    }
    else if(password.length < 8){
        showalertshit("Tól rövid jelszó");
        return;
    }
    else if(amount.length < 1){
        showalertshit("Túl kevés összeg");
        return;
    }
    const regreq = new XMLHttpRequest();
    regreq.open("post", '/register');
    regreq.setRequestHeader('Content-Type', 'application/json');
    regreq.send(JSON.stringify({
        'registerUsername': username,
        'registerPassword': password,
        'regAmount': amount

    }));
    regreq.onreadystatechange = () => {
        if (regreq.readyState == 4) {
            const result = JSON.parse(regreq.response);
            console.log(result.message);
            if(regreq.status == 403){
            showalertshit(result.message);
            }
            else{
                showalertshit(result.message, "y")
                gotologin()
            }
        }
    }
}


function Login() {
    const username = document.getElementById('usernameInput').value;
    const password = document.getElementById('passwordInput').value;

    const LoginRequest = new XMLHttpRequest();

    LoginRequest.open("post", '/login');
    LoginRequest.setRequestHeader('Content-Type', 'application/json');
    LoginRequest.send(JSON.stringify({
        'loginUsername': username,
        'loginPassword': password
    }));
    LoginRequest.onreadystatechange = () => {
        if (LoginRequest.readyState == 4) {
            if (LoginRequest.status == 200) {
                const result = JSON.parse(LoginRequest.response);
                console.log(result.response);
                sessionStorage.setItem('token',result.token)
                console.log('Sikeres token mentés')
                next();
            } else {
                showalertshit("Hibás jelszó/felhasználónév")
            }
        }
    }
}

function next() {
    const loading = document.createElement('div');

    // Initial styles
    loading.style.position = "fixed";
    loading.style.top = "0";
    loading.style.left = "0";
    loading.style.width = "100vw";
    loading.style.height = "100vh";
    loading.style.backgroundColor = "black";
    loading.style.opacity = "0";
    loading.style.transition = "opacity 1s ease-in-out";
    loading.style.zIndex = "99999";

    document.body.appendChild(loading);

    requestAnimationFrame(() => {
        loading.style.opacity = "1";

        setTimeout(() => {
            document.body.style.background = "#002850";
            document.body.style.backgroundAttachment = "fixed";
            loadMenu();

            requestAnimationFrame(() => {
                loading.style.transition = "opacity 2s ease-in-out";
                loading.style.opacity = "0";
            });

            // Ensure removal even if transitionend doesn't fire
            setTimeout(() => {
                if (loading.parentNode) {
                    loading.remove();
                }
            }, 2500); // Slightly longer than the transition time
        }, 1000);
    });

    const main = document.getElementById('main');
    if (main) main.remove();
}


function loadMenu() {
    const nav = document.createElement('nav');
    const header = document.createElement('header');
    const profileImg = document.createElement('img');
    const menuImg = document.createElement('img');
    const title = document.createElement('p');

    const usernametext = document.createElement('p')


    profileImg.src = "assets/profile2.png";
    menuImg.src = "assets/menu.png";

    header.classList.add("header-1");
    profileImg.classList.add("profileImg-1");
    title.classList.add('title-2');
    menuImg.classList.add("menuImg-1");
    usernametext.classList.add("menuUser-1")

    document.body.appendChild(header);
    header.appendChild(menuImg);
    header.appendChild(title);
    header.appendChild(usernametext)
    header.appendChild(profileImg);

    title.innerText = "Roulette";
    usernametext.innerHTML ="név"

    const datadiv = document.createElement('div')
    const divtitle = document.createElement('p')
    const osszeglabel = document.createElement('label')
    const osszeg = document.createElement('p')

    datadiv.classList.add("datadiv-1")
    osszeglabel.classList.add('osszeglabel-1')
    divtitle.classList.add('divtitle-1')

    document.body.appendChild(datadiv)
    datadiv.appendChild(divtitle)
    datadiv.appendChild(osszeglabel)
    datadiv.appendChild(osszeg)

    osszeglabel.innerText="Összeg: "
    divtitle.innerText = "Adatok"







}


function showalertshit(text, type){
    const alerttext = document.getElementById('alert')

    if(type == "y"){
        alerttext.style.color = "rgba(0,191,0,1)"
    }
    else{
        alerttext.style.color = "rgba(237,67,55,1)"

    }

    alerttext.style.display = "inline"
    alerttext.innerText = text
}

const registerButton = document.getElementById('registerButton')
const loginButton = document.getElementById('loginButton')
const amountInput = document.getElementById('amountInput')

amountInput.style.display = "none"
registerButton.style.display = "none"


const registertext = document.getElementById('donthaveanaccountyet')
registertext.addEventListener('click', function(){
    gotoregister()
    
})


function gotoregister(){
    document.getElementById('alert').value = '';

    registertext.style.display="none"
    registerButton.style.display = "inline"
    loginButton.style.display = "none"
    amountInput.style.display = "block"
}

function gotologin(){
    document.getElementById('usernameInput').value = '';
    document.getElementById('passwordInput').value = '';
    document.getElementById('amountInput').value = '';

    registertext.style.display = "block";
    registerButton.style.display = "none";
    loginButton.style.display = "inline";
    amountInput.style.display = "none";
}