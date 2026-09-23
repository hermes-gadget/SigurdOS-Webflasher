const CHANNEL_LABELS = Object.freeze({
  stable: 'Stable',
  beta: 'Beta',
  debug: 'Debug',
});

function deriveUiState({
  connected = false,
  connectionPending = false,
  connectionOutcome = null,
  channel = null,
  hasReleaseData = false,
  flashing = false,
  flashOutcome = null,
  monitoring = false,
} = {}) {
  const channelLabel = CHANNEL_LABELS[channel] || null;
  let connectionStatus;
  if (monitoring) {
    connectionStatus = { status: 'success', text: 'Monitoring' };
  } else if (connectionPending) {
    connectionStatus = { status: 'busy', text: 'Connecting' };
  } else if (connectionOutcome === 'error') {
    connectionStatus = { status: 'error', text: 'Failed' };
  } else if (connected) {
    connectionStatus = { status: 'success', text: 'Connected' };
  } else {
    connectionStatus = { status: 'ready', text: 'Not connected' };
  }
  const flashStatus = flashing
    ? { status: 'busy', text: 'Flashing' }
    : flashOutcome === 'success'
      ? { status: 'success', text: 'Flashed!' }
      : flashOutcome === 'error'
        ? { status: 'error', text: 'Failed' }
        : { status: 'ready', text: 'Ready' };

  return {
    connectLabel: connected ? 'Disconnect' : 'Connect T-Deck',
    connectEnabled: !connectionPending && !flashing && !monitoring,
    flashLabel: flashing
      ? 'Flashing…'
      : flashOutcome === 'success'
        ? 'Flash Complete ✓'
        : flashOutcome === 'error'
          ? 'Try Again'
          : channelLabel
            ? `Flash ${channelLabel} Firmware`
            : 'Select Firmware',
    flashEnabled: connected && Boolean(channel) && hasReleaseData &&
      !connectionPending && !flashing && !monitoring,
    connectionStatus,
    channelStatus: channel
      ? { status: 'success', text: 'Selected' }
      : { status: 'ready', text: 'Not selected' },
    flashStatus,
  };
}

export { deriveUiState };
