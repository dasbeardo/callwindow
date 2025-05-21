let areaCodes = null;

async function loadAreaCodes() {
  if (!areaCodes) {
    const resp = await fetch('us_area_codes_with_iana.json');
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
  const input = document.getElementById('areaCode').value.trim();
  const resultDiv = document.getElementById('result');
  
  if (!/^\d{3}$/.test(input)) {
    resultDiv.textContent = "Please enter exactly 3 digits.";
    return;
  }
  
  await loadAreaCodes();
  const info = findAreaCodeInfo(input);

  if (!info) {
    resultDiv.textContent = "Area code not found.";
    return;
  }

  const currentTime = getCurrentTime(info.iana_timezone);

  resultDiv.innerHTML = `
    <b>Area Code:</b> ${info.area_code}<br>
    <b>Location:</b> ${info.location}<br>
    <b>Time Zone:</b> ${info.timezone}<br>
    <b>Current Time:</b> ${currentTime}
  `;
});