# Withme_AuthServer

## Socket /auth {path: /socket}
handshake: { mobileID: string }

모바일 디바이스에서 서비스 실행 시 연결해야 할 인증서버

이벤트 목록
* Authed
* error

### Authed - to Client
{ Authed: boolean, code?: number }

* Authed: 인증 여부
* code: 인증 번호 6자리 (Authed가 false인 경우에만)

인증이 완료될 때 서버에서 클라이언트로 Authed 이벤트 발생

## POST /auth
NUGU 에서 접근 가능한 경로

캔들의 고유값을 읽어 인증을 완료합니다.
