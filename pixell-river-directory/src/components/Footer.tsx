import { useMemo } from "react";

export default function Footer() {
  const year = useMemo(() => new Date().getFullYear(), []);
  return (
    <footer className="site-footer">
      <small>© Pixell River Financial {year}. All rights reserved.</small>
    </footer>
  );
}