describe('#isNgZoneEnabled', () => {
  it('should return true if Zone is NOT undefined and Zone.current is present', () => {
    pending();
  });

  it('should return false if Zone is defined but Zone.current is NOT present', () => {
    pending();
  });
});

describe('#runOutsideAngular', () => {
  describe('in zone', () => {
    it('should call callback with zone.root.run', () => {
      pending();
    });
  });

  describe('outside zone', () => {
    it('should call callback without callback', () => {
      pending();
    });
  });
});
