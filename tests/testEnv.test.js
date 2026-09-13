import assert from 'node:assert/strict';

const nativeCustomEvent = globalThis.CustomEvent;
const originalDispatchEvent = globalThis.window.dispatchEvent;

try {
  delete globalThis.CustomEvent;
  await import(`./test-env.js?custom-event-regression=${Date.now()}`);

  const detail = { source: 'test harness' };
  const event = new globalThis.CustomEvent('harness-event', { detail });
  let dispatchedEvent;
  globalThis.window.dispatchEvent = (candidate) => {
    dispatchedEvent = candidate;
    return true;
  };

  assert.equal(globalThis.window.dispatchEvent(event), true);
  assert.equal(dispatchedEvent.type, 'harness-event');
  assert.strictEqual(dispatchedEvent.detail, detail);
} finally {
  globalThis.CustomEvent = nativeCustomEvent;
  globalThis.window.dispatchEvent = originalDispatchEvent;
}

console.log('Test environment CustomEvent regression test passed.');
