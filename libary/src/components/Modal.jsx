const Modal = ({ onClose, children }) => (
  <div
    style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      background: 'rgba(0,0,0,0.7)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 1000,
    }}
    onClick={onClose}
  >
    <div
      style={{
        background: 'white',
        padding: '30px',
        borderRadius: '10px',
        maxWidth: '600px',
        width: '90%',
      }}
      onClick={(e) => e.stopPropagation()}
    >
      {children}
      <button onClick={onClose} style={{ marginTop: '20px', padding: '10px 20px' }}>
        Закрыть
      </button>
    </div>
  </div>
);

export default Modal;