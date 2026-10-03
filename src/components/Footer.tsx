export function Footer() {
  return (
    <footer className="no-print mt-16 border-t border-border px-4 py-6 text-center text-xs leading-relaxed text-muted-foreground">
      <p className="mx-auto mb-2 max-w-3xl">
        Dieses Werk enthält Material aus den System Reference Documents 5.1 und 5.2 von Wizards of the Coast, lizenziert unter CC BY 4.0.
        Weitere Hintergrund- und Unterklassennamen stammen aus den Spielerhandbüchern und sind nur als Bezeichnung enthalten.
        Die vorgeschriebenen Lizenzhinweise im Original:
      </p>
      <p className="mx-auto mb-2 max-w-3xl" lang="en">
        This work includes material taken from the System Reference Document 5.1 ("SRD 5.1") by Wizards of the Coast LLC and
        available at{" "}
        <a className="underline hover:text-primary" href="https://dnd.wizards.com/resources/systems-reference-document" target="_blank" rel="noreferrer">
          https://dnd.wizards.com/resources/systems-reference-document
        </a>
        . The SRD 5.1 is licensed under the Creative Commons Attribution 4.0 International License available at{" "}
        <a className="underline hover:text-primary" href="https://creativecommons.org/licenses/by/4.0/legalcode" target="_blank" rel="noreferrer">
          https://creativecommons.org/licenses/by/4.0/legalcode
        </a>
        .
      </p>
      <p className="mx-auto max-w-3xl" lang="en">
        This work includes material from the System Reference Document 5.2 ("SRD 5.2") by Wizards of the
        Coast LLC, available at{" "}
        <a className="underline hover:text-primary" href="https://www.dndbeyond.com/srd" target="_blank" rel="noreferrer">
          https://www.dndbeyond.com/srd
        </a>
        . The SRD 5.2 is licensed under the Creative Commons Attribution 4.0 International License, available at{" "}
        <a className="underline hover:text-primary" href="https://creativecommons.org/licenses/by/4.0/legalcode" target="_blank" rel="noreferrer">
          https://creativecommons.org/licenses/by/4.0/legalcode
        </a>
        .
      </p>
    </footer>
  );
}
