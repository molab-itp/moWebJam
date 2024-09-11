//


function dbase_report_status(props) {
    if (!my.statusElement) {
      createStatusElement();
      if (!my.statusElement) return;
      createQRCode();
    }
    let msg = props.msg || ''
    if (msg) msg = msg + ' ';
    let muid = my.uid || '';
    let uid = props.uid || '';
    let visit_count = props.visit_count || '';
    let ndevice = props.ndevice || '';
    my.statusElement.textContent = `${msg}${muid} ${uid} (${visit_count}) [${ndevice}]`;
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
  

 let qrcode_url = "https://molab-itp.github.io/p5moExamples/examples/let-america-rewind/qrcode/s0/let-america-rewind.png"
//     <img src="../../qrcode/mo-blackfacts-qrcode.png" width="300" id="id_qrcode_src" /></div>


function createQRCode() {
  console.log('createQRCode document', document, 'my.qrcodeElement', my.qrcodeElement )
    if (!document) return;
    if (my.qrcodeElement) return;

    let w = Math.floor(window.innerWidth * 0.25);
    let x = window.innerWidth - w;;

    my.qrcodeElement = document.createElement('img');
    my.qrcodeElement.style.position = 'fixed';
    my.qrcodeElement.style.bottom = '0';
    my.qrcodeElement.style.right = '0';
    // my.qrcodeElement.style.left = `${x}px`;
    // my.qrcodeElement.style.width = `${w}px`;
    my.qrcodeElement.style.zIndex = 1000;

    position_qrcode();
    // my.qrcodeElement.width = `${Math.floor( 100 * my.qrCodeWidth)}%`

    my.qrcodeElement.src = qrcode_url;

    document.body.appendChild(my.qrcodeElement);

    console.log('createQRCode my.qrcodeElement', my.qrcodeElement )

}

function position_qrcode() {
  // console.log('position_bottom');
  my.qrcodeElement.width = Math.floor(window.innerWidth * my.qrCodeWidth);
}
globalThis.position_qrcode = position_qrcode;
