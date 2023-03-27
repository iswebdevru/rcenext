import { BaseLayout } from '@/layouts';
import { Button } from '@/shared/ui/button';
import { InputText } from '@/shared/ui/Input';

export default function Login() {
  return (
    <BaseLayout>
      <div className="flex items-center justify-center w-full h-full p-3">
        <div className="flex-grow max-w-sm px-6 py-10 bg-white border rounded-lg border-slate-200 md:px-8 md:py-12">
          <h1 className="mb-8 text-xl font-bold text-center md:text-2xl">
            Аутентификация
          </h1>
          <form>
            <div className="mb-4">
              <label className="block mb-1 text-sm font-semibold" htmlFor="">
                Пользователь
              </label>
              <InputText required />
            </div>
            <div className="mb-8">
              <label className="block mb-1 text-sm font-semibold" htmlFor="">
                Пароль
              </label>
              <InputText required />
            </div>
            <Button type="submit" className="w-full h-8" variant="primary">
              Войти
            </Button>
          </form>
        </div>
      </div>
    </BaseLayout>
  );
}
