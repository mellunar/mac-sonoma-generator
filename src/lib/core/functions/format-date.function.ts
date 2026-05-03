import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export default function formatDate(date: string | number | Date, formatStr = 'PP') {
	return format(date, formatStr, {
		locale: ptBR,
	});
}
