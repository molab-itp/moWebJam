//

function dbase_report_status(props) {
  if (!my.statusElement) {
    createStatusElement();
    if (!my.statusElement) return;
    createQRCode();
  }
  let msg = props.msg;
  if (!msg) {
    let muid = my.uid || '';
    let uid = props.uid || '';
    let visit_count = props.visit_count || '';
    let ndevice = props.ndevice || '';
    msg = `${muid} ${uid} (${visit_count}) [${ndevice}]`;
  }
  my.statusElement.textContent = msg;
}
globalThis.dbase_report_status = dbase_report_status;

function createStatusElement() {
  if (!document) return;
  if (!my.statusElement) {
    my.statusElement = document.createElement('div');
    document.body.appendChild(my.statusElement);
    my.statusElement.style.position = 'fixed';
    my.statusElement.style.pointerEvents = 'none';
  }

  let h = 10;
  let x = 0;

  my.statusElement.style.position = 'fixed';
  my.statusElement.style.bottom = '0';
  my.statusElement.style.left = `${x}px`;
  my.statusElement.style.width = `100%`;

  my.statusElement.style.zIndex = 1000;
  my.statusElement.style.backgroundColor = 'black';
  // my.statusElement.style.backgroundColor = 'green';
  my.statusElement.style.color = 'white';
  my.statusElement.style.fontSize = `${h}px`;
  my.statusElement.style.padding = '1px 2px';
}
// globalThis.dbase_positionStatus = dbase_positionStatus;

function qrcode_url() {
  // let url = `https://molab-itp.github.io/p5moExamples/examples/let-america-rewind/qrcode/${my.group}/let-america-rewind.png`;
  // https://molab-itp.github.io/moSalon/src/let-america-be/qrcode/s0/let-america-rewind.png

  // let url = `https://molab-itp.github.io/p5moExamples/examples/let-america-rewind/qrcode/${my.group}/let-america-rewind.png`;
  let url = `https://molab-itp.github.io/moSalon/src/let-america-be/qrcode/${my.group}.png`;

  console.log('qrcode_url', url);
  return url;
}
//     <img src="../../qrcode/mo-blackfacts-qrcode.png" width="300" id="id_qrcode_src" /></div>

function init_qrcode_url() {
  my.qrcodeElement.src = qrcode_url();
}
globalThis.init_qrcode_url = init_qrcode_url;

function createQRCode() {
  console.log('createQRCode document', document, 'my.qrcodeElement', my.qrcodeElement);
  if (!document) return;
  if (my.qrcodeElement) return;

  my.footerElement = document.createElement('div');
  document.body.appendChild(my.footerElement);

  my.footerElement.style.position = 'fixed';
  my.footerElement.style.bottom = '0';
  my.footerElement.style.left = '0';
  my.footerElement.style.zIndex = 999;
  my.footerElement.style.width = '100%';
  my.footerElement.style.height = '192px';
  my.footerElement.style.backgroundColor = 'black';
  my.footerElement.style.color = 'white';
  my.footerElement.innerHTML = footerText; // 'HELLO';

  // let w = Math.floor(window.innerWidth * 0.25);
  // let x = window.innerWidth - w;

  my.qrcodeElement = document.createElement('img');
  my.qrcodeElement.style.position = 'fixed';
  my.qrcodeElement.style.bottom = '0';
  my.qrcodeElement.style.right = '0';
  my.qrcodeElement.style.zIndex = 1000;
  my.qrcodeElement.style.width = `${Math.floor(100 * my.qrCodeWidth)}%`;

  my.qrcodeElement.src = qrcode_url();

  document.body.appendChild(my.qrcodeElement);
  // my.footerElemnt.appendChild(my.qrcodeElement);

  console.log('createQRCode my.qrcodeElement', my.qrcodeElement);
}

let footerText = `
  <div >
    <h1> POWER TO THE PEOPLE!</h1> 
    <h3>scan the qrcode to control this screen  </h2>
    <br/>
    <h3>Let America Be  </h2>
  </div>
`;
// function position_qrcode() {
//   // console.log('position_bottom');
//   // my.qrcodeElement.width = Math.floor(window.innerWidth * my.qrCodeWidth);
// }
// globalThis.position_qrcode = position_qrcode;
