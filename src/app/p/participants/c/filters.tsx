// Filters for participant page

"use client";

import { SearchOutlined } from "@ant-design/icons";
import { Button, Checkbox, Input, Select } from "antd";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";

const rankLabels: Record<string, string> = {
  Sestra_miloserdiya: "Сестра милосердия",
  Chinovnik: "Чиновник",
  Chinovnik_voennogo_vedomstva: "Чиновник военного ведомства",
  Nizhniy_chin: "Нижний чин",
  Ofitser: "Офицер",
  Ryadovoy: "Рядовой",
  Efreytor: "Ефрейтор",
  Mladshiy_unter_ofitser: "Младший унтер-офицер",
  Starshiy_unter_ofitser: "Старший унтер-офицер",
  Feldfebel: "Фельдфебель",
  Podpraporshchik: "Подпрапорщик",
  Praporshchik: "Прапорщик",
  Podporuchik: "Подпоручик",
  Poruchik: "Поручик",
  Shtab_kapitan: "Штабс-капитан",
  Kapitan: "Капитан",
  Podpolkovnik: "Подполковник",
  Polkovnik: "Полковник",
  General_mayor: "Генерал-майор",
  General_leytenant: "Генерал-лейтенант",
  General_ot_infanterii: "Генерал от инфантерии",
  Kanonir: "Канонир",
  Bombardir: "Бомбардир",
  Mladshiy_feyerverker: "Младший фейерверкер",
  Starshiy_feyerverker: "Старший фейерверкер",
  Vakhmistr: "Вахмистр",
  General_ot_kavalerii: "Генерал от кавалерии",
  Kazak: "Казак",
  Mladshiy_uryadnik: "Младший урядник",
  Starshiy_uryadnik: "Старший урядник",
  Khorunzhiy: "Хорунжий",
  Sotnik: "Сотник",
  Podesaul: "Подъесаул",
  Esaul: "Есаул",
  Voyskovoy_starshina: "Войсковой старшина",
  Matros: "Матрос",
  Kvartirmeyster: "Квартирмейстер",
  Botsman: "Боцман",
  Konduktor: "Кондуктор",
  Kapitan_2_ranga: "Капитан 2-го ранга",
  Kapitan_1_ranga: "Капитан 1-го ранга",
  Kontr_admiral: "Контр-адмирал",
  Vitse_admiral: "Вице-адмирал",
  Admiral: "Адмирал",
  Michman: "Мичман",
  Leytenant: "Лейтенант",
  Starshiy_leytenant: "Старший лейтенант",
  Kollezhskiy_registrator: "Коллежский регистратор",
  Provintsialnyy_sekretar: "Провинциальный секретарь",
  Gubernskiy_sekretar: "Губернский секретарь",
  Kollezhskiy_sekretar: "Коллежский секретарь",
  Titulyarnyy_sovetnik: "Титулярный советник",
  Kollezhskiy_asesor: "Коллежский асессор",
  Nadvornyy_sovetnik: "Надворный советник",
  Kollezhskiy_sovetnik: "Коллежский советник",
  Taynyy_sovetnik: "Тайный советник",
  Deystvitelnyy_statskiy_sovetnik: "Действительный статский советник",
  Statskiy_sovetnik: "Статский советник",
  Deystvitelnyy_taynyy_sovetnik: "Действительный тайный советник",
};

export default function Filters() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const q = searchParams.get("q") || "";
  const rank = searchParams.get("rank") || "";
  const division = searchParams.get("division") || "";
  const isDrozdovec = searchParams.get("isDrozdovec") === "1";
  const is198 = searchParams.get("is198") === "1";

  const applyFilters = useCallback(
    (updates: Record<string, string | undefined>) => {
      const params = new URLSearchParams(searchParams.toString());
      for (const [key, value] of Object.entries(updates)) {
        if (value) {
          params.set(key, value);
        } else {
          params.delete(key);
        }
      }
      // Reset to page 1 when filters change
      params.delete("page");
      router.push(`?${params.toString()}`);
    },
    [router, searchParams],
  );

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    applyFilters({
      q: (formData.get("q") as string) || undefined,
      rank: (formData.get("rank") as string) || undefined,
      division: (formData.get("division") as string) || undefined,
      isDrozdovec: formData.get("isDrozdovec") === "on" ? "1" : undefined,
      is198: formData.get("is198") === "on" ? "1" : undefined,
    });
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-sky-100 rounded my-4 p-3 flex flex-wrap items-end gap-3"
    >
      <div className="flex flex-col gap-1 min-w-[200px]">
        <label className="text-xs text-gray-500">ФИО</label>
        <Input
          name="q"
          defaultValue={q}
          placeholder="Поиск по ФИО..."
          prefix={<SearchOutlined />}
          allowClear
        />
      </div>

      <div className="flex flex-col gap-1 min-w-[180px]">
        <label className="text-xs text-gray-500">Звание</label>
        <Select
          defaultValue={rank || undefined}
          placeholder="Все звания"
          allowClear
          onChange={(value) => applyFilters({ rank: value || undefined })}
          options={Object.entries(rankLabels).map(([key, label]) => ({
            value: key,
            label,
          }))}
          className="w-full"
        />
      </div>
      <div className="flex flex-col gap-1 min-w-[180px]">
        <label className="text-xs text-gray-500">Войсковая часть</label>
        <Input
          name="division"
          defaultValue={division}
          placeholder="Название части..."
          allowClear
        />
      </div>

      <div className="flex flex-col gap-1">
        <Checkbox name="isDrozdovec" defaultChecked={isDrozdovec}>
          Дроздовец
        </Checkbox>
        <Checkbox name="is198" defaultChecked={is198}>
          198-й полк
        </Checkbox>
      </div>

      <Button type="primary" htmlType="submit" icon={<SearchOutlined />}>
        Поиск
      </Button>
    </form>
  );
}
