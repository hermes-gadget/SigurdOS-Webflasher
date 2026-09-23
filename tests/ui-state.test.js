import assert from 'node:assert/strict';
import test from 'node:test';

import { deriveUiState } from '../assets/ui-state.js';

test('auto-selected firmware becomes flashable when the serial connection completes', () => {
  const disconnected = deriveUiState({
    channel: 'beta',
    hasReleaseData: true,
  });
  assert.equal(disconnected.flashEnabled, false);
  assert.equal(disconnected.connectLabel, 'Connect T-Deck');
  assert.equal(disconnected.channelStatus.text, 'Selected');

  const connected = deriveUiState({
    connected: true,
    channel: 'beta',
    hasReleaseData: true,
  });
  assert.equal(connected.flashEnabled, true);
  assert.equal(connected.connectLabel, 'Disconnect');
  assert.equal(connected.flashLabel, 'Flash Beta Firmware');
  assert.deepEqual(connected.connectionStatus, { status: 'success', text: 'Connected' });
});

test('successful flash clears the connected label and disables flash until reconnect', () => {
  const complete = deriveUiState({
    connected: false,
    channel: 'stable',
    hasReleaseData: true,
    flashOutcome: 'success',
  });
  assert.equal(complete.connectLabel, 'Connect T-Deck');
  assert.equal(complete.flashLabel, 'Flash Complete ✓');
  assert.equal(complete.flashEnabled, false);
  assert.deepEqual(complete.connectionStatus, { status: 'ready', text: 'Not connected' });
  assert.deepEqual(complete.flashStatus, { status: 'success', text: 'Flashed!' });
});

test('flash and connection controls stay disabled while flashing or monitoring', () => {
  const flashing = deriveUiState({
    connected: true,
    channel: 'debug',
    hasReleaseData: true,
    flashing: true,
  });
  assert.equal(flashing.connectEnabled, false);
  assert.equal(flashing.flashEnabled, false);
  assert.deepEqual(flashing.flashStatus, { status: 'busy', text: 'Flashing' });

  const monitoring = deriveUiState({
    connected: true,
    channel: 'debug',
    hasReleaseData: true,
    monitoring: true,
  });
  assert.equal(monitoring.connectEnabled, false);
  assert.equal(monitoring.flashEnabled, false);
  assert.deepEqual(monitoring.connectionStatus, { status: 'success', text: 'Monitoring' });

  const disconnectedAfterFailure = deriveUiState({ connectionOutcome: 'error' });
  assert.deepEqual(disconnectedAfterFailure.connectionStatus, { status: 'error', text: 'Failed' });
});
