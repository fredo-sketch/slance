// Peta ikon eksplisit supaya bundle tidak menarik seluruh library ikon.
import { BarChart3, Briefcase, CalendarCheck, Code2, Languages, Megaphone, Palette, PenLine } from "lucide-react";

export const categoryIcons = { Palette, Code2, PenLine, Megaphone, BarChart3, Languages, CalendarCheck, Briefcase };
export const iconByName = (name) => categoryIcons[name] || Briefcase;
