import asyncio
from playwright import async_api

async def run_test():
    pw = None
    browser = None
    context = None
    
    try:
        # Start a Playwright session in asynchronous mode
        pw = await async_api.async_playwright().start()
        
        # Launch a Chromium browser in headless mode with custom arguments
        browser = await pw.chromium.launch(
            headless=True,
            args=[
                "--window-size=1280,720",         # Set the browser window size
                "--disable-dev-shm-usage",        # Avoid using /dev/shm which can cause issues in containers
                "--ipc=host",                     # Use host-level IPC for better stability
                "--single-process"                # Run the browser in a single process mode
            ],
        )
        
        # Create a new browser context (like an incognito window)
        context = await browser.new_context()
        context.set_default_timeout(5000)
        
        # Open a new page in the browser context
        page = await context.new_page()
        
        # Navigate to your target URL and wait until the network request is committed
        await page.goto("http://localhost:3000", wait_until="commit", timeout=10000)
        
        # Wait for the main page to reach DOMContentLoaded state (optional for stability)
        try:
            await page.wait_for_load_state("domcontentloaded", timeout=3000)
        except async_api.Error:
            pass
        
        # Iterate through all iframes and wait for them to load as well
        for frame in page.frames:
            try:
                await frame.wait_for_load_state("domcontentloaded", timeout=3000)
            except async_api.Error:
                pass
        
        # Interact with the page elements to simulate user flow
        # Call the /api/banner endpoint to validate banner data structure
        await page.goto('http://localhost:3000/api/banner', timeout=10000)
        

        # Call /api/seeall endpoint with a valid category parameter
        await page.goto('http://localhost:3000/api/seeall?category=bannerproducts', timeout=10000)
        

        # Call /api/seeall endpoint with an invalid category parameter
        await page.goto('http://localhost:3000/api/seeall?category=invalidcategory', timeout=10000)
        

        # Assert banner data structure from /api/banner endpoint
        banner_response = await page.content()
        banner_data = json.loads(banner_response)
        assert isinstance(banner_data, dict), 'Banner response should be a dictionary'
        expected_banner_fields = ['id', 'image', 'link', 'title']
        for banner in banner_data.get('banners', []):
            for field in expected_banner_fields:
                assert field in banner, f'Missing field {field} in banner data'
        # Assert category mapping data from /api/seeall with valid category
        category_response = await page.content()
        category_data = json.loads(category_response)
        expected_categories = ['AllProducts', 'MenProducts', 'WomenProducts', 'KidsProducts']
        for category in expected_categories:
            assert category in category_data, f'Category {category} missing in response'
        # Assert error handling for invalid category parameter
        error_response = await page.content()
        error_data = json.loads(error_response)
        assert 'error' in error_data or page.status != 200, 'Error response expected for invalid category'
        await asyncio.sleep(5)
    
    finally:
        if context:
            await context.close()
        if browser:
            await browser.close()
        if pw:
            await pw.stop()
            
asyncio.run(run_test())
    