# Medición de conversiones — quierovendermas.com.ar

Documento para quien administra las campañas (Meta Ads / Google Tag Manager).

## Instalado en la página

| Herramienta | ID | Dónde |
|---|---|---|
| Meta Pixel | `1637897231368051` | `public/index.html` (`<head>`) — dispara `PageView` en cada carga |
| Google Tag Manager | `GTM-MGQGXK74` | `public/index.html` (`<head>` + `<noscript>` después de `<body>`) |

Los eventos de abajo se envían **por las dos vías a la vez**: al Pixel de Meta directo
(`fbq`) y al `dataLayer` de GTM. El código está en `src/medicion.js`.

## Eventos

| Acción del usuario | Meta Pixel (`fbq`) | GTM `dataLayer` (`event`) | Parámetros |
|---|---|---|---|
| **Agenda una reunión** (la reserva quedó guardada) | `track('Schedule')` | `vcs_reunion_agendada` | `rubro`, `plan` |
| **Pide la guía gratis** (formulario enviado) | `track('Lead')` | `vcs_lead_guia` | `rubro` |
| **Clic en cualquier botón de WhatsApp** | `track('Contact')` | `vcs_whatsapp_click` | `ubicacion` |
| Clic en "Quiero una demo" / "Agendá una demo" | `trackCustom('ClickAgendaDemo')` | `vcs_demo_click` | `ubicacion` |
| Clic en el botón de un plan | `trackCustom('ClickPlan')` | `vcs_plan_click` | `plan` |

Valores de `ubicacion`: `header`, `hero`, `como-funciona`, `plan:plan-60`, `plan:plan-120`,
`plan:plan-ilimitado`, `agenda`, `cierre`, `footer`, `flotante`.

`Schedule` y `Lead` se disparan **sólo cuando el envío fue exitoso**, no al tocar el botón.
Por eso sirven como conversión para optimizar campañas.

## Cómo verificarlo

- **Meta:** Administrador de eventos → Probar eventos → ingresar `https://quierovendermas.com.ar`
  y agendar una reunión de prueba. También funciona la extensión *Meta Pixel Helper* de Chrome.
- **GTM:** Vista previa (Tag Assistant) con la misma URL. Los eventos aparecen con los nombres
  `vcs_...` de la tabla.

## Cambio de dominio

Si la landing cambia de dominio, **avisar antes a quien administra las campañas**:
- Verificación de dominio en Meta Business y la configuración de eventos (Aggregated Event Measurement).
- Contenedor y activadores de GTM si filtran por hostname.
- URLs de destino de los anuncios.
- En el repo: archivo `public/CNAME` y el dominio en GitHub → Settings → Pages.
