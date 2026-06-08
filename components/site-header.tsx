export function SiteHeader() {
  return (
    <header className="border-b border-border">
      <div className="mx-auto flex max-w-[1400px] flex-col gap-3 px-4 py-4 md:flex-row md:items-center md:justify-between md:px-6 md:py-5">
        <div className="flex items-center gap-3 md:gap-4">
          <img
            src="/logo.jpeg"
            alt="Logo"
            className="h-8 w-8 shrink-0 rounded-md object-cover md:h-9 md:w-9"
          />
          <div className="flex min-w-0 items-center gap-2.5 md:gap-3">
            <span className="shrink-0 text-base font-semibold tracking-tight text-foreground md:text-lg">
              C.C.社区
            </span>
            <span className="h-5 w-px shrink-0 bg-border" aria-hidden="true" />
            <span className="truncate text-sm font-medium text-muted-foreground">
              战术小队 CN服务器列表
            </span>
          </div>
        </div>

        <p className="text-xs text-muted-foreground md:text-sm">
          欢迎加入战术小队 [C.C.] 社区{"  "}
          <span className="text-foreground/80">QQ群: 1103348146</span>
        </p>
      </div>
    </header>
  )
}
