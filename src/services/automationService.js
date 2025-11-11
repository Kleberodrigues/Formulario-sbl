/**
 * Automation Service - SBL Onboarding Form
 * Serviço para integração com n8n e automações
 */

import { devLog } from '../utils/helpers.js';

// ====================================
// Configuração
// ====================================

const N8N_WEBHOOK_URL = import.meta.env.VITE_N8N_WEBHOOK_URL;
const APP_URL = import.meta.env.VITE_APP_URL || window.location.origin;

// ====================================
// Webhook n8n - Abandonment Follow-up
// ====================================

/**
 * Envia notificação de abandono para n8n
 * @param {Object} data - Dados do abandono
 * @returns {Promise<Object>} - Resposta do webhook
 */
export async function sendAbandonmentNotification(data) {
  try {
    if (!N8N_WEBHOOK_URL) {
      console.warn('[AutomationService] N8N_WEBHOOK_URL not configured');
      return { success: false, error: 'Webhook URL not configured' };
    }

    const payload = {
      event: 'form_abandoned',
      timestamp: new Date().toISOString(),
      data: {
        email: data.email,
        full_name: data.full_name || '',
        phone: data.phone || '',
        abandoned_at_step: data.current_step || 1,
        language: data.language || 'pt-BR',
        selected_depot: data.selected_depot || '',
        created_at: data.created_at || new Date().toISOString(),
        last_activity: data.last_activity || new Date().toISOString(),
        completed_steps: data.completed_steps || [],
        return_url: `${APP_URL}/onboarding?resume=${encodeURIComponent(data.email)}`,
      },
      metadata: {
        user_agent: navigator.userAgent,
        referrer: document.referrer,
        source: 'sbl_onboarding_form'
      }
    };

    devLog(`Sending abandonment notification for ${data.email}`, 'info');

    const response = await fetch(N8N_WEBHOOK_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();

    devLog(`Abandonment notification sent successfully`, 'success');

    return { success: true, data: result };

  } catch (error) {
    console.error('[AutomationService] Error sending abandonment notification:', error);

    return {
      success: false,
      error: error.message
    };
  }
}

// ====================================
// Webhook n8n - Completion Notification
// ====================================

/**
 * Envia notificação de conclusão para n8n
 * @param {Object} data - Dados da conclusão
 * @returns {Promise<Object>} - Resposta do webhook
 */
export async function sendCompletionNotification(data) {
  try {
    if (!N8N_WEBHOOK_URL) {
      console.warn('[AutomationService] N8N_WEBHOOK_URL not configured');
      return { success: false, error: 'Webhook URL not configured' };
    }

    const payload = {
      event: 'form_completed',
      timestamp: new Date().toISOString(),
      data: {
        candidate_id: data.candidate_id, // UUID da estrutura normalizada
        email: data.email,
        full_name: data.full_name || '',
        phone: data.phone || '',
        language: data.language || 'pt-BR',
        depot_location: data.depot_location || data.selected_depot || '',
        depot_code: data.depot_code || '',
        created_at: data.created_at || new Date().toISOString(),
        completed_at: data.completed_at || new Date().toISOString(),
        all_documents_uploaded: true,
        employment_status: data.employment_status || ''
      },
      metadata: {
        user_agent: navigator.userAgent,
        source: 'sbl_onboarding_form'
      }
    };

    devLog(`Sending completion notification for ${data.email}`, 'info');

    const response = await fetch(N8N_WEBHOOK_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();

    devLog(`Completion notification sent successfully`, 'success');

    return { success: true, data: result };

  } catch (error) {
    console.error('[AutomationService] Error sending completion notification:', error);

    return {
      success: false,
      error: error.message
    };
  }
}

// ====================================
// Webhook n8n - Step Progress Notification
// ====================================

/**
 * Envia notificação de progresso de step (opcional)
 * @param {Object} data - Dados do progresso
 * @returns {Promise<Object>} - Resposta do webhook
 */
export async function sendStepProgressNotification(data) {
  try {
    if (!N8N_WEBHOOK_URL) {
      return { success: false, error: 'Webhook URL not configured' };
    }

    const payload = {
      event: 'step_completed',
      timestamp: new Date().toISOString(),
      data: {
        email: data.email,
        step_number: data.current_step,
        step_name: data.step_name || '',
        completed_steps: data.completed_steps || [],
        total_steps: 12,
        progress_percentage: Math.round((data.completed_steps?.length || 0) / 12 * 100)
      }
    };

    const response = await fetch(N8N_WEBHOOK_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();

    return { success: true, data: result };

  } catch (error) {
    console.error('[AutomationService] Error sending step progress:', error);

    return {
      success: false,
      error: error.message
    };
  }
}

// ====================================
// Email Service (via n8n)
// ====================================

/**
 * Envia email via n8n
 * @param {Object} emailData - Dados do email
 * @returns {Promise<Object>} - Resposta
 */
export async function sendEmail(emailData) {
  try {
    if (!N8N_WEBHOOK_URL) {
      console.warn('[AutomationService] N8N_WEBHOOK_URL not configured');
      return { success: false, error: 'Webhook URL not configured' };
    }

    const payload = {
      event: 'send_email',
      timestamp: new Date().toISOString(),
      data: {
        to: emailData.to,
        subject: emailData.subject,
        body: emailData.body,
        template: emailData.template || 'default',
        variables: emailData.variables || {}
      }
    };

    const response = await fetch(N8N_WEBHOOK_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();

    devLog(`Email sent to ${emailData.to}`, 'success');

    return { success: true, data: result };

  } catch (error) {
    console.error('[AutomationService] Error sending email:', error);

    return {
      success: false,
      error: error.message
    };
  }
}

// ====================================
// WhatsApp Service (via n8n)
// ====================================

/**
 * Envia mensagem WhatsApp via n8n
 * @param {Object} whatsappData - Dados da mensagem
 * @returns {Promise<Object>} - Resposta
 */
export async function sendWhatsApp(whatsappData) {
  try {
    if (!N8N_WEBHOOK_URL) {
      console.warn('[AutomationService] N8N_WEBHOOK_URL not configured');
      return { success: false, error: 'Webhook URL not configured' };
    }

    const payload = {
      event: 'send_whatsapp',
      timestamp: new Date().toISOString(),
      data: {
        phone: whatsappData.phone,
        message: whatsappData.message,
        template: whatsappData.template || 'default',
        variables: whatsappData.variables || {}
      }
    };

    const response = await fetch(N8N_WEBHOOK_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();

    devLog(`WhatsApp sent to ${whatsappData.phone}`, 'success');

    return { success: true, data: result };

  } catch (error) {
    console.error('[AutomationService] Error sending WhatsApp:', error);

    return {
      success: false,
      error: error.message
    };
  }
}

// ====================================
// Analytics Tracking
// ====================================

/**
 * Registra evento de analytics via n8n
 * @param {string} eventName - Nome do evento
 * @param {Object} properties - Propriedades do evento
 * @returns {Promise<Object>} - Resposta
 */
export async function trackEvent(eventName, properties = {}) {
  try {
    if (!N8N_WEBHOOK_URL) {
      return { success: false, error: 'Webhook URL not configured' };
    }

    const payload = {
      event: 'analytics_event',
      event_name: eventName,
      timestamp: new Date().toISOString(),
      properties: {
        ...properties,
        url: window.location.href,
        user_agent: navigator.userAgent,
        referrer: document.referrer
      }
    };

    const response = await fetch(N8N_WEBHOOK_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();

    return { success: true, data: result };

  } catch (error) {
    console.error('[AutomationService] Error tracking event:', error);

    return {
      success: false,
      error: error.message
    };
  }
}

// ====================================
// Slack Notifications (via n8n)
// ====================================

/**
 * Envia notificação Slack via n8n
 * @param {Object} slackData - Dados da notificação
 * @returns {Promise<Object>} - Resposta
 */
export async function sendSlackNotification(slackData) {
  try {
    if (!N8N_WEBHOOK_URL) {
      return { success: false, error: 'Webhook URL not configured' };
    }

    const payload = {
      event: 'slack_notification',
      timestamp: new Date().toISOString(),
      data: {
        channel: slackData.channel || '#onboarding',
        message: slackData.message,
        type: slackData.type || 'info', // info, success, warning, error
        user: slackData.user || '',
        metadata: slackData.metadata || {}
      }
    };

    const response = await fetch(N8N_WEBHOOK_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();

    return { success: true, data: result };

  } catch (error) {
    console.error('[AutomationService] Error sending Slack notification:', error);

    return {
      success: false,
      error: error.message
    };
  }
}

// ====================================
// Helper Functions
// ====================================

/**
 * Verifica se webhook está configurado
 * @returns {boolean}
 */
export function isWebhookConfigured() {
  return !!N8N_WEBHOOK_URL;
}

/**
 * Obtém URL do webhook
 * @returns {string}
 */
export function getWebhookUrl() {
  return N8N_WEBHOOK_URL || '';
}

/**
 * Testa conexão com webhook
 * @returns {Promise<boolean>}
 */
export async function testWebhook() {
  try {
    if (!N8N_WEBHOOK_URL) {
      console.warn('[AutomationService] N8N_WEBHOOK_URL not configured');
      return false;
    }

    const response = await fetch(N8N_WEBHOOK_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        event: 'webhook_test',
        timestamp: new Date().toISOString(),
        message: 'Test connection from SBL Onboarding Form'
      })
    });

    return response.ok;

  } catch (error) {
    console.error('[AutomationService] Webhook test failed:', error);
    return false;
  }
}

// ====================================
// Exportar Funções
// ====================================

export default {
  // Abandonment & Completion
  sendAbandonmentNotification,
  sendCompletionNotification,
  sendStepProgressNotification,

  // Communication
  sendEmail,
  sendWhatsApp,
  sendSlackNotification,

  // Analytics
  trackEvent,

  // Helpers
  isWebhookConfigured,
  getWebhookUrl,
  testWebhook
};
