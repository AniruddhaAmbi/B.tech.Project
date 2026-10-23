
export default function DociqLogo({ collapsed = false }) {
  return (
    <div className={`dociq-logo ${collapsed ? "collapsed" : ""}`}>
      <div className="dociq-logo-mark">
        <span></span>
        <span></span>
        <span></span>
      </div>

      {!collapsed && (
        <span className="dociq-logo-text">DOCIQ</span>
      )}
    </div>
  );
}