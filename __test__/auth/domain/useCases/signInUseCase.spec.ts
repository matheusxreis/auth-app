class SignInUseCase {
  async execute (email: string, password: string) {
    if (!email || !password) {
      throw new Error();
    }
  }
}

const makeSut = () => {
  const sut = new SignInUseCase();

  return { sut };
};
describe('SignInUseCase', () => {
  it('should throw a error if email is empty', async () => {
    const { sut: sutPromise } = makeSut();

    expect(sutPromise.execute('', 'password')).rejects.toThrow();
  });
  it('should throw a error if password is empty', async () => {
    const { sut: sutPromise } = makeSut();

    expect(sutPromise.execute('matheus.reis@gmail.com', '')).rejects.toThrow();
  });
});
