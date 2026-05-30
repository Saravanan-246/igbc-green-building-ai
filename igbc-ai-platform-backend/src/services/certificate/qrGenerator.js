import QRCode from "qrcode";

const generateQRCode = async (payload) => {
  const qrPayload =
    typeof payload === "string" ? payload : JSON.stringify(payload);

  return QRCode.toDataURL(qrPayload, {
    errorCorrectionLevel: "M",
    margin: 2,
    width: 320,
  });
};

export default generateQRCode;
export { generateQRCode };
