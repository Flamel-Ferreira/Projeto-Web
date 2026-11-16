import Modal from './Modal.jsx';
import Button from './Button.jsx';

export default function ConfirmDialog({
  open,
  title,
  description,
  confirmLabel = 'Confirmar',
  cancelLabel = 'Cancelar',
  destructive = false,
  onConfirm,
  onCancel,
}) {
  return (
    <Modal
      open={open}
      onClose={onCancel}
      title={title}
      size="sm"
      footer={
        <div className="flex justify-end gap-2">
          <Button variant="ghost" onClick={onCancel}>
            {cancelLabel}
          </Button>
          <Button
            variant={destructive ? 'danger' : 'primary'}
            onClick={onConfirm}
            autoFocus
          >
            {confirmLabel}
          </Button>
        </div>
      }
    >
      <p className="text-sm leading-relaxed text-text-secondary">{description}</p>
    </Modal>
  );
}
