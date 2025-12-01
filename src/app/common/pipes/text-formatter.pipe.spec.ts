import { TextFormatterPipe } from './text-formatter.pipe';

describe('TextFormatterPipe', () => {
  it('create an instance', () => {
    const pipe = new TextFormatterPipe();
    expect(pipe).toBeTruthy();
  });
});
