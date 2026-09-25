/**
 * Native and Web Platform Biometric Authentication Service
 * Supports Face ID, Touch ID, Windows Hello, and Android Biometric Prompts
 * via the W3C Web Authentication (WebAuthn) Platform Authenticator.
 */

const CREDENTIAL_ID_KEY = 'kapsule_biometric_cred_id';

export const NativeBiometricsService = {
  /**
   * Checks if the device hardware supports biometric verification
   * (Face ID, Touch ID, Fingerprint, Windows Hello).
   */
  async isAvailable(): Promise<boolean> {
    if (typeof window === 'undefined') return false;
    if (!window.PublicKeyCredential) return false;

    try {
      if (typeof PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable === 'function') {
        const available = await PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable();
        return Boolean(available);
      }
      return false;
    } catch (e) {
      console.debug('Biometric availability check failed:', e);
      return false;
    }
  },

  /**
   * Registers a biometric key on this specific device.
   */
  async enrollBiometrics(userName: string = 'Kapsule User'): Promise<boolean> {
    if (!await this.isAvailable()) return false;

    try {
      const challenge = new Uint8Array(32);
      window.crypto.getRandomValues(challenge);

      const userId = new Uint8Array(16);
      window.crypto.getRandomValues(userId);

      const credential = await navigator.credentials.create({
        publicKey: {
          challenge,
          rp: {
            name: 'Kapsüle Kasa',
            id: window.location.hostname || 'localhost',
          },
          user: {
            id: userId,
            name: userName,
            displayName: userName,
          },
          pubKeyCredParams: [
            { alg: -7, type: 'public-key' },  // ES256
            { alg: -257, type: 'public-key' } // RS256
          ],
          authenticatorSelection: {
            authenticatorAttachment: 'platform',
            userVerification: 'required',
            requireResidentKey: false,
          },
          timeout: 60000,
        },
      }) as PublicKeyCredential | null;

      if (credential && credential.rawId) {
        const base64Id = btoa(String.fromCharCode(...new Uint8Array(credential.rawId)));
        localStorage.setItem(CREDENTIAL_ID_KEY, base64Id);
        return true;
      }
      return false;
    } catch (err) {
      console.warn('Biometric enrollment error:', err);
      return false;
    }
  },

  /**
   * Authenticates the user via biometric prompt (Face ID / Fingerprint).
   */
  async authenticate(): Promise<boolean> {
    if (!await this.isAvailable()) return false;

    const storedId = localStorage.getItem(CREDENTIAL_ID_KEY);

    try {
      const challenge = new Uint8Array(32);
      window.crypto.getRandomValues(challenge);

      const allowCredentials: PublicKeyCredentialDescriptor[] = storedId
        ? [
            {
              id: Uint8Array.from(atob(storedId), c => c.charCodeAt(0)),
              type: 'public-key',
              transports: ['internal'],
            },
          ]
        : [];

      const assertion = await navigator.credentials.get({
        publicKey: {
          challenge,
          timeout: 60000,
          userVerification: 'required',
          ...(allowCredentials.length > 0 ? { allowCredentials } : {}),
        },
      });

      return Boolean(assertion);
    } catch (err) {
      // User canceled or authentication failed
      console.debug('Biometric authentication error or canceled:', err);
      return false;
    }
  },

  /**
   * Checks whether the user has enrolled biometrics previously.
   */
  hasEnrolled(): boolean {
    if (typeof localStorage === 'undefined') return false;
    return Boolean(localStorage.getItem(CREDENTIAL_ID_KEY));
  },

  /**
   * Clears enrolled biometric credentials.
   */
  clearEnrollment(): void {
    if (typeof localStorage !== 'undefined') {
      localStorage.removeItem(CREDENTIAL_ID_KEY);
    }
  },
};
