# How to make a https certificate for localhost

Install mkcert
```bash
brew install mkcert
```

Add the mkcert root certificate to your system's trust store
```bash
mkcert -install
```

Create a certificate for localhost
```bash
mkcert localhost
```
