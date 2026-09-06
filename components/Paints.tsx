/* The two lights every face is painted with.
 *
 *  A gradient referenced by `url(#face-hi)` has to exist somewhere in the
 *  document, and this is that somewhere — mounted once for the whole site
 *  rather than repeated inside every face, which would be one definition per
 *  bot on a page that means to show a great many of them.
 *
 *  Sized to nothing rather than hidden. A paint server inside a `display: none`
 *  subtree resolves in Chrome and does not in WebKit, so hiding this the
 *  obvious way gives every Safari reader a page of flat silhouettes and no
 *  error to explain it. Zero by zero is out of the way in both. */

export default function Paints() {
  return (
    <svg className="paints" aria-hidden="true" width={0} height={0}>
      <defs>
        <radialGradient id="face-hi" cx="32%" cy="22%" r="70%">
          <stop offset="0%" stopColor="#fff" stopOpacity="0.34" />
          <stop offset="70%" stopColor="#fff" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="face-lo" x1="0" y1="0.45" x2="0" y2="1">
          <stop offset="0%" stopColor="#000" stopOpacity="0" />
          <stop offset="100%" stopColor="#000" stopOpacity="0.22" />
        </linearGradient>
      </defs>
    </svg>
  );
}
