let areaCodes = null;

async function loadAreaCodes() {
  if (!areaCodes) {
    const resp = await fetch('areacodes.json'); // Make sure this matches your file!
    areaCodes = await resp.json();
  }
}

function findAreaCodeInfo(code) {
  return areaCodes.find(entry => entry.area_code === code);
}

function getCurrentTime(ianaTimeZone) {
  try {
    return new Date().toLocaleString('en-US', {
      timeZone: ianaTimeZone,
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  } catch (e) {
    return 'Invalid Timezone';
  }
}

document.getElementById('lookupForm').addEventListener('submit', async function(e) {
  e.preventDefault();
  const inputElem = document.getElementById('areaCode');
  const input = inputElem.value.trim();
  const resultDiv = document.getElementById('result');

  if (!/^\d{3}$/.test(input)) {
    resultDiv.textContent = "Please enter exactly 3 digits.";
    inputElem.focus();
    inputElem.select();
    return;
  }

  await loadAreaCodes();
  const info = findAreaCodeInfo(input);

  if (!info) {
    resultDiv.textContent = "Area code not found.";
    inputElem.focus();
    inputElem.select();
    return;
  }

  const currentTime = getCurrentTime(info.iana_timezone);

  resultDiv.innerHTML = `
    <b>Area Code:</b> ${info.area_code}<br>
    <b>Location:</b> ${info.location}<br>
    <b>Time Zone:</b> ${info.timezone}<br>
    <b>Current Time:</b> ${currentTime}
  `;
  inputElem.focus();
  inputElem.select();
});