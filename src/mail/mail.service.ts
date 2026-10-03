import { Inject, Injectable, Logger } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { trabajador_rol } from '@prisma/client';

export type WorkerInvitation = {
  to: string;
  name: string;
  lastName: string;
  role: trabajador_rol;
  password: string;
};

const ROLE_LABELS: Record<trabajador_rol, string> = {
  anfitrion: 'Anfitrión',
  mozo: 'Mozo',
  cocinero: 'Cocinero',
  asistente_de_cocina: 'Asistente de cocina',
  almacenero: 'Almacenero',
  jefe: 'Jefe',
  administrador: 'Administrador',
};

@Injectable()
export class MailService {
  private readonly logger = new Logger(MailService.name);

  constructor(@Inject(MailerService) private readonly mailer: MailerService) {}

  async sendWorkerInvitation(invitation: WorkerInvitation): Promise<boolean> {
    try {
      await this.mailer.sendMail({
        to: invitation.to,
        subject: 'Invitación a TURTLE',
        html: this.buildInvitationHtml(invitation),
      });
      return true;
    } catch (error) {
      const detail =
        error instanceof Error ? error.message : 'error desconocido';
      this.logger.error(
        `No se pudo enviar la invitación a ${invitation.to}: ${detail}`,
      );
      return false;
    }
  }

  private buildInvitationHtml(invitation: WorkerInvitation): string {
    const name = escapeHtml(`${invitation.name} ${invitation.lastName}`.trim());
    const role = escapeHtml(ROLE_LABELS[invitation.role] ?? invitation.role);
    const email = escapeHtml(invitation.to);
    const password = escapeHtml(invitation.password);

    return `
      <p>Hola ${name},</p>
      <p>Te registraron en TURTLE como <strong>${role}</strong>.</p>
      <p>Usa estos datos para iniciar sesión:</p>
      <ul>
        <li>Correo: ${email}</li>
        <li>Contraseña temporal: <strong>${password}</strong></li>
      </ul>
      <p>Si no esperabas este mensaje, ignóralo.</p>
    `;
  }
}

function escapeHtml(value: string): string {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}
