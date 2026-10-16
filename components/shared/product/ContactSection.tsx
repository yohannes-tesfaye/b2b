"use client";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function ContactSection() {
  const t = useTranslations("product");

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="bg-gray-900 text-white p-8 rounded-lg">
        <h2 className="text-xl font-bold mb-4">{t("contactTitle")}</h2>
        <p className="text-gray-300 text-sm mb-6">{t("contactIntro")}</p>
        <div className="space-y-4 text-sm">
          <div>
            <p className="text-gray-400">{t("email")}</p>
            <a
              href={`mailto:${t("contactEmail")}`}
              className="font-medium hover:underline"
            >
              {t("contactEmail")}
            </a>
          </div>
          <div>
            <p className="text-gray-400">{t("phone")}</p>
            <a
              href={`tel:${t("contactPhone").replace(/\s/g, "")}`}
              className="font-medium hover:underline"
            >
              {t("contactPhone")}
            </a>
          </div>
          <div>
            <p className="text-gray-400">{t("address")}</p>
            <p className="font-medium">{t("contactAddress")}</p>
          </div>
        </div>
      </div>

      <div className="lg:col-span-2 bg-white border border-gray-200 p-8 rounded-lg">
        <h2 className="text-xl font-bold text-gray-900 mb-6">
          {t("sendMessageTitle")}
        </h2>
        <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t("name")}
              </label>
              <Input placeholder={t("namePlaceholder")} name="name" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t("email")}
              </label>
              <Input
                type="email"
                placeholder={t("emailPlaceholder")}
                name="email"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {t("subject")}
            </label>
            <Input placeholder={t("subjectPlaceholder")} name="subject" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {t("message")}
            </label>
            <textarea
              placeholder={t("messagePlaceholder")}
              name="message"
              rows={5}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <Button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white"
          >
            {t("sendMessage")}
          </Button>
        </form>
      </div>
    </div>
  );
}
