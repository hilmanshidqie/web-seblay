import Image from "next/image";
import EasterEggs, { Logo } from "@/components/EasterEggs";
import ReasonForm from "@/components/ReasonForm";
import { place } from "@/components/place";
import styles from "./page.module.css";

// Layout mirrors the Figma "HOME PAGE" frame (1440 × 2348). Coordinates are
// design pixels and z values follow the Figma layer order (bottom → top).

/** `sizes` hint for an image that is `w` design pixels wide on the canvas. */
const sizesFor = (w: number) =>
  `(min-width: 1024px) ${Math.round((w / 1440) * 100)}vw, 100vw`;

export default function HomePage() {
  return (
    <>
      <div className={styles.page}>
        <div className={styles.canvas}>
          <header className={styles.header}>
            <Logo
              className={`${styles.abs} ${styles.logo}`}
              style={place(30, 30, { w: 107, h: 36, z: 7 })}
            />

            <nav
              className={`${styles.abs} ${styles.nav}`}
              style={place(504, 32, { w: 432, h: 32, z: 8 })}
              aria-label="Utama"
            >
              <a href="/" className={`${styles.navLink} ${styles.underline}`}>
                HOME
              </a>
              <a href="#" className={`${styles.navLink} ${styles.underline}`}>
                ABOUT
              </a>
              <a href="#" className={`${styles.navLink} ${styles.underline}`}>
                COLLECTION
              </a>
            </nav>

            <img
              src="/assets/dot.svg"
              alt=""
              width={23}
              height={23}
              className={`${styles.abs} ${styles.sized} ${styles.dot}`}
              style={place(1079, 85, { w: 23, h: 23, z: 20 })}
            />
            <p
              className={`${styles.abs} ${styles.textThin12} ${styles.tagline}`}
              style={place(1113, 80, { z: 10 })}
            >
              KARENA HIDUP TERLALU SERIUS
              <br />
              UNTUK DILAKUKAN SERIUS
            </p>
            <button
              type="button"
              aria-label="Menu"
              className={`${styles.abs} ${styles.sized} ${styles.menu}`}
              style={place(1379, 61.48, { w: 18, h: 19.127, z: 9 })}
            >
              <img src="/assets/menu.svg" alt="" width={18} height={19.127} />
            </button>
          </header>

          <main className={styles.main}>
            <section className={styles.hero}>
              <Image
                src="/assets/saturn.png"
                loading="eager"
                alt=""
                width={680}
                height={453}
                sizes={sizesFor(680)}
                className={`${styles.abs} ${styles.sized} ${styles.cover} ${styles.saturn}`}
                style={place(919, 535, { w: 680, h: 453, z: 2 })}
              />
              <Image
                src="/assets/mountains.png"
                loading="eager"
                alt=""
                width={1281}
                height={233}
                sizes={sizesFor(1281)}
                className={`${styles.abs} ${styles.sized} ${styles.cover} ${styles.mountains}`}
                style={place(-13, 645, { w: 1281, h: 233, z: 3 })}
              />
              <Image
                src="/assets/tv.png"
                loading="eager"
                alt="Televisi: alasan baru sedang diformulasi"
                width={366}
                height={294}
                sizes={sizesFor(366)}
                className={`${styles.abs} ${styles.sized} ${styles.cover} ${styles.tv}`}
                style={place(1138, 321, { w: 366, h: 294, z: 4 })}
              />
              <Image
                src="/assets/woman.png"
                loading="eager"
                alt=""
                width={204}
                height={194}
                sizes={sizesFor(204)}
                className={`${styles.abs} ${styles.sized} ${styles.cover} ${styles.woman}`}
                style={place(25, 240, { w: 204, h: 194, z: 5 })}
              />
              <Image
                src="/assets/sticky-note.png"
                loading="eager"
                alt="Kerja? Nanti saja."
                width={238}
                height={154}
                sizes={sizesFor(238)}
                className={`${styles.abs} ${styles.sized} ${styles.cover} ${styles.sticky}`}
                style={place(184, 114, { w: 238, h: 154, z: 6 })}
              />

              <p
                className={`${styles.abs} ${styles.textThin12} ${styles.index}`}
                style={place(40, 165, { z: 11 })}
              >
                [ 01 ]
              </p>
              <p
                className={`${styles.abs} ${styles.textThin12} ${styles.eksistensi}`}
                style={place(40, 192, { z: 12 })}
              >
                EKSISTENSI
                <br />
                MEMBUTUHKAN
                <br />
                ALASAN
              </p>

              <h1 className={styles.headline}>
                <span
                  className={`${styles.abs} ${styles.headlineTop}`}
                  style={place(274, 220, { z: 13 })}
                >
                  MESIN{"  "}PENGHASIL
                </span>
                <span
                  className={`${styles.abs} ${styles.headlineBottom}`}
                  style={place(375, 368, { z: 14 })}
                >
                  ALASAN
                </span>
              </h1>

              <div
                className={`${styles.abs} ${styles.sized} ${styles.rotBox} ${styles.ellipse}`}
                style={place(259, 331, { w: 831.878, h: 324.897, z: 15 })}
                aria-hidden="true"
              >
                <img
                  src="/assets/ellipse-ring.svg"
                  alt=""
                  width={812}
                  height={185}
                  className={styles.ellipseImg}
                />
              </div>

              <p
                className={`${styles.abs} ${styles.textThin12} ${styles.upper} ${styles.random}`}
                style={place(893, 604, { z: 16 })}
              >
                Random alasan untuk segala situasi
              </p>
              <p
                className={`${styles.abs} ${styles.textThin12} ${styles.mencari}`}
                style={place(29, 611, { z: 17 })}
              >
                MENCARI DESTINASI
                <br />
                WISATA BUKAN DISINI TEMPATNYA!
              </p>

              <a
                href="#form-alasan"
                className={`${styles.abs} ${styles.sized} ${styles.cta}`}
                style={place(753, 639, { w: 298, h: 60, z: 19 })}
              >
                <span>MULAI CARI ALASAN</span>
                <img src="/assets/arrow-down.svg" alt="" width={20} height={20} className={styles.ctaIcon} />
              </a>

              <p
                className={`${styles.abs} ${styles.textThin12} ${styles.selamat}`}
                style={place(433, 163, { z: 21 })}
              >
                SELAMAT SIANG PAK 🙏🏻.. mohon maaf hari ini saya izin cuti.
                <br />
                Karena website ini menghasut saya. TERIMA KASIH BOZZZZ.
              </p>

              <div
                className={`${styles.abs} ${styles.sized} ${styles.rotBox} ${styles.handArrow}`}
                style={place(552, 553, { w: 190.324, h: 190.324, z: 23 })}
                aria-hidden="true"
              >
                <img
                  src="/assets/hand-arrow.svg"
                  alt=""
                  width={142}
                  height={142}
                  className={styles.handArrowImg}
                />
              </div>

              <img
                src="/assets/chevrons.svg"
                alt=""
                width={52}
                height={91}
                className={`${styles.abs} ${styles.sized} ${styles.chevrons}`}
                style={place(897, 709, { w: 52, h: 91, z: 27 })}
              />

              <p
                className={`${styles.abs} ${styles.seni}`}
                style={place(7, 873, { z: 24 })}
              >
                ALASAN ADALAH SENI DARI PENUNDAAN
              </p>
            </section>

            <section className={styles.formSection}>
              <ReasonForm />

              <div
                className={`${styles.abs} ${styles.disclaimer}`}
                style={place(78, 1330, { w: 497, h: 130, z: 18 })}
              >
                <p>
                  Namun ingat!
                  <br />
                  Semua kejadian itu kehendak tuhan. Saya hanya menyediakan layanan.
                  <br />
                  Segala konsekuensi ditanggung kalian masing-masing,
                  <br />
                  <br />
                  <br />
                  salam hangat, The Magician
                </p>
              </div>

              <div
                className={`${styles.abs} ${styles.sized} ${styles.rotBox} ${styles.vertical}`}
                style={place(7, 1138, { w: 53, h: 573, z: 31 })}
              >
                <p className={styles.verticalText}>SETIAP ALASAN PUNYA CERITA</p>
              </div>

              <Image
                src="/assets/rock.png"
                alt=""
                width={679}
                height={208}
                sizes={sizesFor(679)}
                className={`${styles.abs} ${styles.sized} ${styles.cover} ${styles.rock}`}
                style={place(-50, 1607, { w: 679, h: 208, z: 29 })}
              />
              <Image
                src="/assets/cat.png"
                alt="Kucing melambaikan tangan"
                width={318}
                height={318}
                sizes={sizesFor(318)}
                className={`${styles.abs} ${styles.sized} ${styles.cover} ${styles.cat}`}
                style={place(363, 1492, { w: 318, h: 318, z: 30 })}
              />
            </section>
          </main>

          <footer className={styles.footer}>
            <div
              className={`${styles.abs} ${styles.sized} ${styles.band}`}
              style={place(0, 1773, { w: 1440, h: 575, z: 1 })}
              aria-hidden="true"
            />

            <div
              className={`${styles.abs} ${styles.sized} ${styles.berlibur}`}
              style={place(114, 1883, { w: 1211, h: 240, z: 22 })}
            >
              <p className={styles.berliburText}>silahkan berlibur</p>
              <img
                src="/assets/divider.svg"
                alt=""
                width={1207}
                height={2}
                className={styles.divider}
              />
            </div>

            <p
              className={`${styles.abs} ${styles.congrats}`}
              style={place(81, 1782, { z: 26 })}
            >
              Congratulations
            </p>

            <a
              href="#"
              className={`${styles.abs} ${styles.otherCollection}`}
              style={place(984, 2132, { w: 338, h: 48, z: 32 })}
            >
              <span className={`${styles.footerLink} ${styles.underline}`}>OTHER MY COLLECTION</span>
              <img src="/assets/arrow-right-circle.svg" alt="" width={24} height={24} className={styles.arrowRight} />
            </a>

            <div
              className={`${styles.abs} ${styles.contact}`}
              style={place(541, 2125, { w: 360, z: 33 })}
            >
              <a href="mailto:hilmanshidqi06@gmail.com" className={styles.emailPill}>
                HILMANSHIDQI06@GMAIL.COM
              </a>
              <p className={styles.signature}>THE MAGICIAN</p>
            </div>

            <div
              className={`${styles.abs} ${styles.bottomRow}`}
              style={place(41, 2254, { w: 1358, h: 48, z: 34 })}
            >
              <div className={styles.socials}>
                <a href="#" className={`${styles.footerLink} ${styles.underline}`}>
                  LINKEDIN
                </a>
                <a href="#" className={`${styles.footerLink} ${styles.underline}`}>
                  INSTAGRAM
                </a>
              </div>
              <p className={`${styles.footerLink} ${styles.copyright}`}>
                copyright 2026 @hilmanshidqie
              </p>
            </div>
          </footer>
        </div>
      </div>
      {/* Outside .page: its container-type would trap fixed-position overlays. */}
      <EasterEggs />
    </>
  );
}
