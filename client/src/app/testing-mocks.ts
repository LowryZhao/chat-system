// Mock for PeerJS
class MockPeer {
  call() {}
  on() {}
  destroy() {}
}
(window as any).Peer = MockPeer;

// Mock for socket.io-client
(window as any).io = jasmine.createSpy('io').and.returnValue({
  on: jasmine.createSpy('on'),
  emit: jasmine.createSpy('emit'),
  disconnect: jasmine.createSpy('disconnect')
});
