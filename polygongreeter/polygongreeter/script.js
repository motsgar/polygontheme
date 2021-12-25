const timeElement = document.getElementById('time');
const dateElement = document.getElementById('date');
const messageElement = document.getElementById('message');
const statusBarElement = document.getElementById('status-bar');
const reactiveBarsElement = document.getElementById('reactive-bars');
const startupBackgroundElement = document.getElementById('startup-background');

const daysInWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

const session = 'i3';

const reactiveBarCount = 5;
const reactiveBarWidth = 130;
const barStayTime = 80;

const reactiveBars = [];

function show_message(text, type) {
	if (type === 'error') {
		messageElement.style.color = 'red';
	} else {
		messageElement.style.color = 'green';
	}
	messageElement.innerHTML = text;
}

let password = '';

function start_auth() {
	lightdm.authenticate('motsgar');
}

/** (Probably) required by lightdm, but we don't use them */
function show_prompt(text, type) {}
const autologin_timer_expired = username => {};

function auth() {
	lightdm.respond(password);
	password = '';
}

let wrongPasswordStatusRemover;

let checking = false;

function authentication_complete() {
	if (lightdm.is_authenticated) {
		lightdm.start_session(session);
	} else {
		statusBarElement.classList.remove('status-bar-checking');
		statusBarElement.classList.add('status-bar-wrong');
		wrongPasswordStatusRemover = setTimeout(() => {
			statusBarElement.classList.remove('status-bar-wrong');
		}, 2000);
		start_auth();
		checking = false;
	}
}

function updateTime() {
	let date = new Date();
	timeElement.innerText = String(date.getHours()).padStart(2, '0') + ':' + String(date.getMinutes()).padStart(2, '0') + ':' + String(date.getSeconds()).padStart(2, '0');
	dateElement.innerText = daysInWeek[date.getDay()] + ', ' + String(date.getDate()).padStart(2, '0') + '/' + String(date.getMonth() + 1).padStart(2, '0');
}

function checkPassword() {
	if (wrongPasswordStatusRemover !== undefined) {
		clearTimeout(wrongPasswordStatusRemover);
		statusBarElement.classList.remove('status-bar-wrong');
	}
	statusBarElement.classList.add('status-bar-checking');
	checking = true;
	auth();
}

let latestTimeout;
let latestBarIndex;

function typing(type) {
	if (latestTimeout !== undefined) {
		clearTimeout(latestTimeout);
		reactiveBars[latestBarIndex].classList.remove('reactive-bar-type');
		reactiveBars[latestBarIndex].classList.remove('reactive-bar-bs');
	}

	let barIndex = Math.floor(Math.random() * reactiveBarCount);

	if (type) {
		reactiveBars[barIndex].classList.add('reactive-bar-type');
		latestTimeout = setTimeout(() => {
			reactiveBars[barIndex].classList.remove('reactive-bar-type');
			latestTimeout = undefined;
		}, barStayTime);
	} else {
		reactiveBars[barIndex].classList.add('reactive-bar-bs');
		latestTimeout = setTimeout(() => {
			reactiveBars[barIndex].classList.remove('reactive-bar-bs');
			latestTimeout = undefined;
		}, barStayTime);
	}

	latestBarIndex = barIndex;
}

function init() {
	// TODO: handle global keyboard events better
	// also dead keys don't work
	document.addEventListener('keydown', e => {
		if (checking) return;
		if (e.key.length === 1) {
			if (password.length > 200) return;
			password += e.key;
			typing(true);
		} else {
			switch (e.key) {
				case 'Enter':
					checkPassword();
					break;
				case 'Backspace':
					if (password.length !== 0) {
						password = password.slice(0, -1);
						typing(false);
					}
					break;
				default:
					break;
			}
		}
	});

	updateTime();
	setInterval(updateTime, 500);

	for (let i = 0; i < reactiveBarCount; i++) {
		let barElement = document.createElement('div');
		barElement.style.width = Math.floor(reactiveBarWidth / reactiveBarCount) + 'px';
		barElement.style.left = Math.floor((reactiveBarWidth / reactiveBarCount) * i) + 'px';
		barElement.classList.add('reactive-bar');
		reactiveBarsElement.appendChild(barElement);
		reactiveBars.push(barElement);
	}

	setInterval(() => {}, 1000);

	start_auth();

	startupBackgroundElement.style.backgroundColor = 'transparent';
}

window.addEventListener('GreeterReady', () => {
	lightdm.show_prompt.connect(show_prompt);
	lightdm.authentication_complete.connect(authentication_complete);
	lightdm.autologin_timer_expired.connect(autologin_timer_expired);

	init();
});
