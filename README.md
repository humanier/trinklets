Decode URL in Shell (from  https://stackoverflow.com/questions/6250698/how-to-decode-url-encoded-string-in-shell)
```bash
function urldecode() { : "${*//+/ }"; echo -e "${_//%/\\x}"; }

urldecode https%3A%2F%2Fgoogle.com%2Fsearch%3Fq%3Durldecode%2Bbash
https://google.com/search?q=urldecode+bash
```
