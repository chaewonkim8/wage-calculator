const doc = new jsPDF();
doc.text("Hello world!", 10, 10);
doc.save("test.pdf");
