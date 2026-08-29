//tabControle
// JavaScript, um die Tabs zu steuern
const tabs = document.querySelectorAll('.tab');
const contents = document.querySelectorAll('.tab-content');

tabs.forEach(tab => {
tab.addEventListener('click', () => {
    // Entferne aktive Klasse von allen Tabs
    tabs.forEach(t => t.classList.remove('tab-active'));
    // Füge aktive Klasse zum geklickten Tab hinzu
    tab.classList.add('tab-active');

    const target = tab.getAttribute('data-tab');

    // Verstecke alle Inhalte
    contents.forEach(content => {
    content.classList.remove('tab-content-active');
    });

    // Zeige den ausgewählten Inhalt
    document.getElementById(target).classList.add('tab-content-active');
});
});