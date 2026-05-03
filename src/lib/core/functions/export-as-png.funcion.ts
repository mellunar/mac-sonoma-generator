import { domToPng } from 'modern-screenshot';

export default async function exportAsPng(element: HTMLElement) {
	if (!element) return;

	try {
		const dataUrl = await domToPng(element);

		const link = document.createElement('a');
		link.download = 'imagem.png';
		link.href = dataUrl;
		link.click();
	} catch (error) {
		console.error('Erro ao exportar:', error);
	}
}
